import React = require("react");
import { HomePresenter } from "./HomePresenter";
import { HomeModel, Spot, HomeState } from "./HomeModel";
import { StaticData } from "../Common/StaticData";
import { InputSearch, InputChange, InputText } from "../Utils/Inputs";
import { Magellan } from "../Utils/Magellan";
import { HomeRoute, HomeMode } from "../Common/AppRoutes";

interface Props {
    presenter: HomePresenter;
}

export class HomeView extends React.Component<Props, HomeState> {
    setMode(mode: HomeMode) {
        this.setState({ mode: mode});
    }
    constructor(props: any){
        super(props);
        this.state = { 
            spots: [],
            selectedTypes: [], 
            selectedGenders: [], 
            searchText: "", 
            mode: "list" 
        };
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

    toggleGender(gender: string): void {
        let hasGender = this.state.selectedGenders.indexOf(gender) >= 0;
        if (hasGender) {
            this.setState({
                selectedGenders: []
            }, () => this.saveFiltersInLc());
        } else {
            this.setState({
                selectedGenders: [ gender ]
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

    getTypeCardClass(type: string) {
        let hasType = this.state.selectedTypes.indexOf(type) >= 0;
        if (hasType && this.state.mode == "list") {
            return "selected";
        } else {
            return "";
        }
    }

    getGenderCardClass(gender: string) {
        let hasType = this.state.selectedGenders.indexOf(gender) >= 0;
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
        return (<div className={this.isLandingPage() ? "landing": ""}>
            <button className="btn btn-round btn-map">
                <i className="fas fa-map-marker-alt fa-2x"></i>
            </button>
            <div className="home-fixed">
                <div className="home-header">
                    <div className={"home-card"}>
                        <div className="search w-100">
                            <InputSearch
                                name="searchText" 
                                label="" 
                                model={this.state} 
                                onChange={(e) => this.onInputChange(e)} />
                        </div>
                        <div className="welcome-text">
                            <h1 className="text-main uppercase">App Barboni</h1>
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
                    return (<div key={type} className={"type-card " + this.getTypeCardClass(type)} onClick={() => this.toggleType(type)}>
                        <div className="icon"><i className={"fa-4x " + this.getTypeIcon(type)}></i></div>
                        <div className="legend uppercase">{type}</div>
                    </div>);
                }, this)}
            </div>
            <div className="genders-container">
                {StaticData.genders().map(gender => {
                    return (<div key={gender} className={"type-card " + this.getGenderCardClass(gender)} onClick={() => this.toggleGender(gender)}>
                        <div className="legend uppercase">{gender}</div>
                    </div>);
                }, this)}
            </div>
            <div className={"age-card"}>
                            <InputText
                                name="searchText" 
                                label="Età" 
                                model={this.state} 
                                onChange={(e) => this.onInputChange(e)} />
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