import { Route, Magellan, RouteId } from "../Utils/Magellan";
import UserUtility from "./UserUtility";

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

    },

    goToLogin() {

    }
};