import { HomeView } from "./HomeView";
import { HomeModel } from "./HomeModel";
import { BasePresenter } from "../Common/BaseMVP";
import UserUtility from "../Common/UserUtility";

export class HomePresenter extends BasePresenter<HomeView, HomeModel> {
    loadHome() {
        throw new Error("Method not implemented.");
    }
    
    
}