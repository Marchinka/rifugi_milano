import React = require("react");
import { HomePresenter } from "./HomePresenter";
import { HomeModel, Spot, HomeState } from "./HomeModel";
import { StaticData } from "../Common/StaticData";
import { InputSearch, InputChange, InputText } from "../Utils/Inputs";
import { Magellan } from "../Utils/Magellan";
import { HomeRoute, HomeMode } from "../Common/AppRoutes";
import { AppMap } from "../Common/MapUtility";

interface Props {
    presenter: HomePresenter;
}

export class HomeView extends React.Component<Props, HomeState> {
    map: AppMap;
    constructor(props: any){
        super(props);
        this.state = { 
            showMap: false,
            spots: [],
            selectedTypes: [], 
            selectedGenders: [], 
            searchText: "", 
            age: "",
            mode: "list" 
        };
        this.map = new AppMap();
    }

    componentDidMount() {
        this.props.presenter.initialize(this);
        let filters = this.props.presenter.getLcFilters();
        this.setState(filters);
        this.map.init({
            mapId: "home-map",
            center: { lat: 45.4696420266612, lng: 9.18695905771667 },
            zoom: 11,
            fullscreenControl: false,
            mapTypeControl: false,
            streetViewControl: false
        });
    }

    setMode(mode: HomeMode) {
        this.setState({ mode: mode});
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
        this.props.presenter.saveFiltersInLc(this.state);
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

            let isCorrectGender = true;
            if (this.state.selectedGenders.length > 0) {
                let isMale = this.state.selectedGenders.indexOf("Maschio") >= 0;
                let isFemale = this.state.selectedGenders.indexOf("Femmina") >= 0;
                if (spot.male && isMale) {
                    isCorrectGender = true;
                } else if (spot.female && isFemale) {
                    isCorrectGender = true;
                } else {
                    isCorrectGender = false;
                }
            }
            let containsText = (spot.name.toLowerCase().match(this.state.searchText.toLowerCase()) || []).length > 0;
            let age = parseFloat(this.state.age);
            
            let hasCorrectAge = true;
            if (age) {
                hasCorrectAge = spot.minAge <= age && age <= spot.maxAge;
            }

            if (isTypeSelected && isCorrectGender && containsText && hasCorrectAge) {
                return true;
            } else {
                return false;
            }
        });
    }

    onInputChange(e: InputChange): void {
        let state = this.state as any;
        state[e.field] = e.value;
        this.setState(state, () => {
            this.saveFiltersInLc();
        });
    }

    getMapContainerClass() {
        return this.state.showMap ? "show-map" : "";
    }

    showMap() {
        this.getFilteredSpots().map(spot => {
            this.map.addMarker(spot);
        });
        this.setState({ showMap: true });
    }

    hideMap() {
        this.setState({ showMap: false });
        this.map.clear();
    }

    render() {
        return (<div className={this.isLandingPage() ? "landing": ""}>
            <div className={"map-container " + this.getMapContainerClass()}>
                <button className="btn btn-round btn-close-map" type="button" onClick={() => this.hideMap()}>
                    <i className="fas fa-times fa-2x"></i>
                </button>
                <div id="home-map" className="map-div"></div>
            </div>
            <button className="btn btn-round btn-map" type="button" onClick={() => this.showMap()}>
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
                                name="age" 
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