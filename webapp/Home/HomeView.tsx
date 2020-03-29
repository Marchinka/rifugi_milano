import React = require("react");
import { HomePresenter } from "./HomePresenter";
import { HomeModel, Spot } from "./HomeModel";
import { StaticData } from "../Common/StaticData";
import { InputSearch, InputChange } from "../Utils/Inputs";

interface Props {
    presenter: HomePresenter;
}

export interface State extends HomeModel {
    selectedTypes: string[];
    searchText: string;
}

const FILTERS_LC_KEY = "FILTERS_LC_KEY";

export class HomeView extends React.Component<Props, State> {
    constructor(props: any){
        super(props);
        this.state = { spots: [], selectedTypes: [], searchText: "" };
    }

    componentDidMount() {
        this.props.presenter.initialize(this);
        let json = localStorage.getItem(FILTERS_LC_KEY);
        let filters = JSON.parse(json);
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

    toggleType(type: string): void {
        let hasType = this.state.selectedTypes.indexOf(type) >= 0;
        if (hasType) {
            this.setState({
                selectedTypes: this.state.selectedTypes.filter((t) => t != type)
            }, () => this.saveFiltersInLc());
        } else {
            this.state.selectedTypes.push(type);
            this.setState({
                selectedTypes: this.state.selectedTypes
            }, () => this.saveFiltersInLc());
        }
    }

    saveFiltersInLc() {
        let filters = {
            selectedTypes: this.state.selectedTypes
        };
        let json = JSON.stringify(filters);
        localStorage.setItem(FILTERS_LC_KEY, json);
    }

    getCardClass(type: string) {
        let hasType = this.state.selectedTypes.indexOf(type) >= 0;
        if (hasType) {
            return "selected";
        } else {
            return "";
        }
    }

    isLandingPage() {
        if ((this.state.selectedTypes || []).length == 0) {
            return true;
        } else {
            return false;
        }
    }

    getFilteredSpots(): Spot[] {
        return this.state.spots.filter(spot => {
            let isTypeSelected = this.state.selectedTypes.indexOf(spot.type) >= 0;

            let containsText = (spot.name.toLowerCase().match(this.state.searchText.toLowerCase()) || []).length > 0;

            if (isTypeSelected && containsText) {
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
        return (<div>
            <div className="home-header">
                <div className={"home-card"}>
                    <InputSearch    className={this.isLandingPage() ? "collapsed" : ""}
                                    name="searchText" 
                                    label="" 
                                    model={this.state} 
                                    onChange={(e) => this.onInputChange(e)} />
                    <p className={this.isLandingPage() ? "" : "collapsed"}>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                    </p>
                </div>
                <div className="types-container">
                    {StaticData.types().map(type => {
                        return (<div key={type} className={"type-card " + this.getCardClass(type)} onClick={() => this.toggleType(type)}>
                            <div className="icon"><i className={"fa-4x " + this.getTypeIcon(type)}></i></div>
                            <div className="legend uppercase">{type}</div>
                        </div>);
                    }, this)}
                </div>
            </div>
            <div className={this.isLandingPage() ? "collapsed" : ""}>
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