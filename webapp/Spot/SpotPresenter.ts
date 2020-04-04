import { SpotView } from "./SpotView";
import { SpotFullModel } from "./SpotModel";
import { BasePresenter } from "../Common/BaseMVP";
import UserUtility from "../Common/UserUtility";

export class SpotPresenter extends BasePresenter<SpotView, SpotFullModel> {
    loadSpot(id: string) {
        this.dao.send({
            url: "/spot/" + id,
            method: "GET"
        }, (response) => {
            this.view.loadSpot(response.data);
        });
    }
}