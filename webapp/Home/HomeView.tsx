import React = require("react");
import { HomePresenter } from "./HomePresenter";
import { HomeModel, Spot } from "./HomeModel";
import { StaticData } from "../Common/StaticData";
import { InputSearch, InputChange } from "../Utils/Inputs";
import { Magellan } from "../Utils/Magellan";
import { HomeRoute, HomeMode } from "../Common/AppRoutes";

interface Props {
    presenter: HomePresenter;
}

export interface State extends HomeModel {
    selectedTypes: string[];
    searchText: string;
    mode: HomeMode;
}


export class HomeView extends React.Component<Props, State> {
    setMode(mode: HomeMode) {
        this.setState({ mode: mode});
    }
    constructor(props: any){
        super(props);
        this.state = { spots: [], selectedTypes: [], searchText: "", mode: "list" };
    }

    componentDidMount() {
        this.props.presenter.initialize(this);
        let filters = this.props.presenter.getLcFilters();
        this.setState(filters);
    }
    
    loadSpots(spots: Spot[]) {
        this.setState({
            spots: spots
        });
    }

    getTypeIcon(type: string) {
        if (type == "Dormitorio") {
            return "fas fa-home";
        } else if (type == "Pasti") {
            return "fas fa-utensils";
        } else {
            return "";
        }
    }

    resetFilters() {
        this.setState({ 
            spots: [], 
            selectedTypes: [], 
            searchText: "" 
        });
    }

    toggleType(type: string): void {
        let hasType = this.state.selectedTypes.indexOf(type) >= 0;
        if (hasType) {
            this.setState({
                selectedTypes: []
            }, () => this.saveFiltersInLc());
        } else {
            this.setState({
                selectedTypes: [ type ]
            }, () => this.saveFiltersInLc());
        }
    }

    saveFiltersInLc() {
        let isLanding = this.state.selectedTypes.length == 0;
        if (isLanding) {
            Magellan.get().goTo(new HomeRoute("landing"));
        } else {
            Magellan.get().goTo(new HomeRoute("list"));
        }
        this.props.presenter.saveFiltersInLc(this.state.selectedTypes);
    }

    getCardClass(type: string) {
        let hasType = this.state.selectedTypes.indexOf(type) >= 0;
        if (hasType && this.state.mode == "list") {
            return "selected";
        } else {
            return "";
        }
    }

    isLandingPage() {
        if (this.state.mode == "landing") {
            return true;
        } else {
            return false;
        }
    }

    getFilteredSpots(): Spot[] {
        return this.state.spots.filter(spot => {
            let isTypeSelected = this.state.selectedTypes.indexOf(spot.type) >= 0;

            let containsText = (spot.name.toLowerCase().match(this.state.searchText.toLowerCase()) || []).length > 0;

            if (isTypeSelected && containsText && this.state.mode == "list") {
                return true;
            } else {
                return false;
            }
        });
    }

    onInputChange(e: InputChange): void {
        this.setState({
            searchText: e.value
        });
    }

    render() {
        return (<div className={this.isLandingPage() ? "landing": ""}>
            <button className="btn btn-round btn-map">
                <i className="fas fa-map-marker-alt fa-2x"></i>
            </button>
            <div className="home-fixed">
                <div className="home-header">
                    <div className={"home-card"}>
                        <div className="search">
                            <InputSearch
                                name="searchText" 
                                label="" 
                                model={this.state} 
                                onChange={(e) => this.onInputChange(e)} />
                        </div>
                        <div className="welcome-text">
                            <h1 className="text-color1 uppercase">App Barboni</h1>
                            <p>
                                Una scritta di qualche tipo che dica due cose sull'app e li inviti a selezionare quello che gli interessa.
                            </p>
                            <p>
                                Magari un link all'associazione?
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="types-container">
                        {StaticData.types().map(type => {
                            return (<div key={type} className={"type-card " + this.getCardClass(type)} onClick={() => this.toggleType(type)}>
                                <div className="icon"><i className={"fa-4x " + this.getTypeIcon(type)}></i></div>
                                <div className="legend uppercase">{type}</div>
                            </div>);
                        }, this)}
                    </div>
            <div className="spot-list">
                {(this.getFilteredSpots() || []).map(spot => {
                    return (<div key={spot._id} className="spot-card">
                        <div className="spot-img">
                            <i className="placeholder-icon fas fa-camera-retro"></i>
                        </div>
                        <div className="spot-legend">
                            <span className="address">{spot.address}</span>
                            <span className="name">{spot.name}</span>
                        </div>
                    </div>);
                }, this)}
            </div>
        </div>)
    }
}