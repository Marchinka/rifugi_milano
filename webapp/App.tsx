import React = require("react");
import ReactDOM = require("react-dom");
import { RouteId, Magellan, Route } from "./Utils/Magellan";
import { RouteWrapper } from "./Utils/Navigation";
import Layout from "./Common/Layout";
import { AdminPresenter } from "./Admin/AdminPresenter";
import { SpotPresenter } from "./Spot/SpotPresenter";
import { HomeView } from "./Home/HomeView";
import { AdminView } from "./Admin/AdminView";
import { HomePresenter } from "./Home/HomePresenter";
import { HomeRoute, SpotRoute } from "./Common/AppRoutes";
import { SpotView } from "./Spot/SpotView";

const adminPresenter = new AdminPresenter();
const spotPresenter = new SpotPresenter();
const homePresenter = new HomePresenter();

class App extends React.Component<{}> {
    render() {
        return (<Layout>
            <RouteWrapper<RouteId> route={new HomeRoute("list")}>
                <HomeView presenter={homePresenter} />
            </RouteWrapper>

            <RouteWrapper<RouteId> route={new SpotRoute("0000")}>
                <SpotView presenter={spotPresenter} />
            </RouteWrapper>

            <RouteWrapper<RouteId> route={new RouteId("Admin")}>
                <AdminView presenter={adminPresenter} />
            </RouteWrapper>
        </Layout>);
    }
}

ReactDOM.render(<App />, document.getElementById("app-body"));

const magellan = Magellan.get();
magellan.setDefault(new HomeRoute("list"));
magellan.onRouteId("Home", () => {
    let route = magellan.getCurrentRoute<HomeRoute>();
    homePresenter.loadHome();
    let hasFilters = homePresenter.hasFilters();

    if (route.mode == "list" && !hasFilters) {
        magellan.goTo(new HomeRoute("landing"));
    } else {
        homePresenter.setMode(route.mode);
    }
});
magellan.onRouteId("Spot", () => {
    let route = magellan.getCurrentRoute<SpotRoute>();
    spotPresenter.loadSpot(route.id);
});
magellan.onRouteId("Admin", () => {

});
magellan.start();