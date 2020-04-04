import React = require("react");
import { SpotPresenter } from "./SpotPresenter";
import { SpotFullModel } from "./SpotModel";
import { Spot } from "../Home/HomeModel";

interface Props {
    presenter: SpotPresenter;
}


export interface State extends SpotFullModel {
}

export class SpotView extends React.Component<Props, State> {
    constructor(props: any){
        super(props);
        this.state = { spot: {} } as State;
    }

    componentDidMount() {
        this.props.presenter.initialize(this);
    }

    loadSpot(spot: Spot) {
        this.setState({ spot: spot });
    }

    render() {
        return (<div className="full-spot">
            <div className="spot-img">
                <i className="placeholder-icon fas fa-camera-retro"></i>
            </div>
            <h1 className="name">{this.state.spot.name}</h1>
            <h4 className="type">{this.state.spot.type}</h4>
            <p>
                {this.state.spot.male && <span className="badge">Maschi</span>}
                {this.state.spot.female && <span className="badge">Femmine</span>}
            </p>
            <p className="address">{this.state.spot.address}</p>
            <p className="age">Età: {this.state.spot.minAge} - {this.state.spot.maxAge}</p>
            <p className="description">{this.state.spot.description}</p>
        </div>)
    }
}