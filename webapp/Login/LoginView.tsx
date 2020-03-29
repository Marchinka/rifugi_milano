import React = require("react");
import { LoginPresenter } from "./LoginPresenter";
import { LoginModel as LoginModel } from "./LoginModel";
import { InputText, InputChange } from "../Utils/Inputs";
import RouteUtility from "../Common/RouteUtility";
import { Magellan, RouteId } from "../Utils/Magellan";

interface LoginViewProps {
    presenter: LoginPresenter;
}

export class LoginView extends React.Component<LoginViewProps, LoginModel> {
    constructor(props: any){
        super(props);
        this.state = { username: "", password: "", message: "" };
    }

    componentDidMount() {
        this.props.presenter.initialize(this);
    }

    changeState(e: InputChange): void {
        var value = e.value;
        let state = this.state as any;
        state[e.field] = value;
        this.setState(state);
    }

    login(e: any): void {
        e.preventDefault();
        this.props.presenter.login(this.state, () => {
            let routeForRedirect = RouteUtility.getRouteForRedirect();
            if (routeForRedirect) {
                Magellan.get().goTo(routeForRedirect);
            } else {
                Magellan.get().goTo(new RouteId("Feed"));
            }
            RouteUtility.setRouteForRedirect(null);
        });
    }
    
    loadLoginModel(arg0: LoginModel) {
        this.setState(arg0);
    }

    render() {
        return (<div>
            <h1>Login</h1>
            <p>{this.state.message}</p>
            <form onSubmit={(e) => this.login(e)}>
                <InputText label="Username" name="username" model={this.state} onChange={e => this.changeState(e)}/>
                <InputText label="Password" name="password" model={this.state} isPassword={true} onChange={e => this.changeState(e)}/>
                <button>Login</button>
            </form>
        </div>)
    }
}