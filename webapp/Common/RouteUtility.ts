import { Route, Magellan, RouteId } from "../Utils/Magellan";
import UserUtility from "./UserUtility";
import { LoginRoute } from "./AppRoutes";

let _route : Route = null;

export default {
    setRouteForRedirect(route: Route) {
        let routeId = (route as any).routeId;
        if (routeId != "Login") {
            _route = route;
        } else {
            _route = null;
        }
    },
    getRouteForRedirect() {
        return _route;
    },
    checkAuthentication() {
        if (!UserUtility.isUserLogginIn()) {
            let currentRoute = Magellan.get().getCurrentRoute<Route>();
            (currentRoute as any).data = null; // TODO boooooh
            this.setRouteForRedirect(currentRoute);
            Magellan.get().goTo(new LoginRoute());
            return true;
        }
        else {
            return false;
        }
    },

    goToLogin() {
        Magellan.get().goTo(new LoginRoute("Your session is expired: please login again."));
    }
};