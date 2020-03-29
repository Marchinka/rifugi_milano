import React = require("react");
import { Magellan, Mode, Route } from "./Magellan";
import ReactDOM = require("react-dom");

export interface NavigationState {
    show: boolean;
}

export interface NavigationProps {
    routeId: string;
}

export class NavigationItem<T extends Route> extends React.Component<NavigationProps, NavigationState> {

    constructor(props :any){
        super(props);
        this.state = {
            show: false
        } as NavigationState;
    }

    componentDidMount() {
        var magellan =  Magellan.get();

        magellan.onRouteId(this.props.routeId, () => {
            this.setState({
                show: true
            });
        });

        magellan.notOnRouteId(this.props.routeId, () => {
            this.setState({
                show: false
            });
        });

        magellan.start();
    }
    
    getStyle(): any {
        if (this.state.show) {
            return { display: "block" };
        } else {
            return { display: "none" };
        }
    }

    render() {
        return (<div style={this.getStyle()}>{this.props.children}</div>);
    }
}

interface LinkProperties {
    target?: string;
    className?: string;
    route: Route;
    clicked?: boolean;
}

export class Link extends React.Component<LinkProperties> {

    onLinkClick(e :any): void {
        e.preventDefault();
        Magellan.get().goTo(this.props.route);
        console.log(this.props.route);
    }
       


    render() {
        return (<a href="" onClick={(e) => this.onLinkClick(e)} target={this.props.target} className={this.props.className}>{this.props.children}</a>);
    }
}

export abstract class NavigationComponent<
    TRoute extends Route, 
    TProps,
    TState> 
     extends React.Component<TProps, TState> {

    constructor(props :any) {
        super(props);
    }

    componentDidMount() {
        var magellan =  Magellan.get();
        var routeDummy = this.getRoute();

        magellan.onRouteId(routeDummy.getRouteId(), () => {
            this.display(magellan);
        });

        magellan.notOnRouteId(routeDummy.getRouteId(), () => {
            this.hide();
        });

        var currentRoute = magellan.getCurrentRoute<TRoute>();
        if (routeDummy.getRouteId() == currentRoute.getRouteId()) {
            this.display(magellan);
        } else {
            this.hide();
        }  
    }

    private display(magellan: Magellan) {
        const node = ReactDOM.findDOMNode(this) as any;
        node.style.display = "block";
        this.onNavigation(magellan.getCurrentRoute<TRoute>());
        window.scrollTo(0,0);
    }

    private hide() {
        const node = ReactDOM.findDOMNode(this) as any;
        this.onCeaseNavigation();
        node.style.display = "none";
    }

    abstract onNavigation(route : TRoute) : void;

    onCeaseNavigation() {

    }

    abstract render(): any;

    abstract getRoute() : Route;
}

interface RouteDivProps<TRoute> {
    route: TRoute;
}

export class RouteWrapper<TRoute extends Route> extends NavigationComponent<TRoute, RouteDivProps<TRoute>, {}> {
    onNavigation(route: {}): void {
        
    }    
    
    getRoute(): Route {
        return this.props.route;
    }
    
    render() {
        return (<React.Fragment>{this.props.children}</React.Fragment>);
    }

}