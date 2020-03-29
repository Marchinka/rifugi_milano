import React = require("react");
import { AdminPresenter } from "./AdminPresenter";
import { AdminModel } from "./AdminModel";

interface Props {
    presenter: AdminPresenter;
}


export interface State extends AdminModel {
}

export class AdminView extends React.Component<Props, State> {
    constructor(props: any){
        super(props);
        this.state = { };
    }

    componentDidMount() {
        this.props.presenter.initialize(this);
    }

    render() {
        return (<div>Ciao admin</div>)
    }
}