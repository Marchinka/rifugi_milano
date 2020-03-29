import { LoginView } from "./LoginView";
import { LoginModel } from "./LoginModel";
import { BasePresenter } from "../Common/BaseMVP";
import UserUtility from "../Common/UserUtility";

export class LoginPresenter extends BasePresenter<LoginView, LoginModel> {

    loadLogin(message: string) {
        this.view.loadLoginModel({
            username: "",
            password: "",
            message: message
        } as LoginModel);
    }

    login(state: LoginModel, callback: () => void) {
        let username = state.username;
        let password = state.password;
        this.dao.send({
            url: "login",
            method: "GET",
            headers: {
                "username": username,
                "password": password
            }
        }, (response: any) => {
            let token = response.data.token;
            UserUtility.setToken(token);
            callback();
        });
    }

    
    
}