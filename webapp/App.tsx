import React = require("react");
import ReactDOM = require("react-dom");
import { RouteId, Magellan, Route } from "./Utils/Magellan";
import { RouteWrapper } from "./Utils/Navigation";
import Layout from "./Common/Layout";
import { AdminPresenter } from "./Admin/AdminPresenter";
import { HomeView } from "./Home/HomeView";
import { AdminView } from "./Admin/AdminView";
import { HomePresenter } from "./Home/HomePresenter";

const adminPresenter = new AdminPresenter();
const homePresenter = new HomePresenter();

class App extends React.Component<{}> {
    render() {
        return (<Layout>
            <RouteWrapper<RouteId> route={new RouteId("Home")}>
                <HomeView presenter={homePresenter} />
            </RouteWrapper>

            <RouteWrapper<RouteId> route={new RouteId("Admin")}>
                <AdminView presenter={adminPresenter} />
            </RouteWrapper>
        </Layout>);
    }
}

ReactDOM.render(<App />, document.getElementById("app-body"));

const magellan = Magellan.get();
magellan.setDefault(new RouteId("Home"));
magellan.onRouteId("Home", () => {
    homePresenter.loadHome();
});
magellan.onRouteId("Admin", () => {

});
magellan.start();