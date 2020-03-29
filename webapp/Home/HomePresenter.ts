import { HomeView } from "./HomeView";
import { HomeModel } from "./HomeModel";
import { BasePresenter } from "../Common/BaseMVP";
import UserUtility from "../Common/UserUtility";

export class HomePresenter extends BasePresenter<HomeView, HomeModel> {
    loadHome() {
        this.dao.send({
            url: "/spots",
            method: "GET"
        }, (response) => {
            this.view.loadSpots(response.data);
        });
    }
}