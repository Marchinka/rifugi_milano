import { HomeView } from "./HomeView";
import { HomeModel } from "./HomeModel";
import { BasePresenter } from "../Common/BaseMVP";
import UserUtility from "../Common/UserUtility";
import { HomeMode } from "../Common/AppRoutes";

const FILTERS_LC_KEY = "FILTERS_LC_KEY";

export class HomePresenter extends BasePresenter<HomeView, HomeModel> {
    setMode(mode: HomeMode) {
        this.view.setMode(mode);
    }
    getLcFilters() : any {
        let json = localStorage.getItem(FILTERS_LC_KEY);
        let filters = JSON.parse(json);
        return filters;
    }
    saveFiltersInLc(selectedTypes: string[]) {
        let filters = {
            selectedTypes: selectedTypes
        };
        let json = JSON.stringify(filters);
        localStorage.setItem(FILTERS_LC_KEY, json);
    }

    hasFilters() : boolean {
        let filters = this.getLcFilters();
        if (filters == null) {
            return false;
        }
        if (!filters.selectedTypes || filters.selectedTypes.length == 0) {
            return false;
        }

        return true;
    }

    resetFilters() {
        this.view.resetFilters();
    }

    loadHome() {
        this.dao.send({
            url: "/spots",
            method: "GET"
        }, (response) => {
            this.view.loadSpots(response.data);
        });
    }
}