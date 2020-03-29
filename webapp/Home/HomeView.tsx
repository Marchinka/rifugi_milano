import React = require("react");
import { HomePresenter } from "./HomePresenter";
import { HomeModel } from "./HomeModel";

interface Props {
    presenter: HomePresenter;
}


export interface State extends HomeModel {
}

export class HomeView extends React.Component<Props, State> {
    constructor(props: any){
        super(props);
        this.state = { };
    }

    componentDidMount() {
        this.props.presenter.initialize(this);
    }

    render() {
        return (<div>Ciao home</div>)
    }
}