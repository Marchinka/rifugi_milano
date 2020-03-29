import React = require("react");
import { PagePresenter } from "./PagePresenter";
import { PageModel } from "./PageModel";

interface FeedViewProps {
    presenter: PagePresenter;
}

export class PageView extends React.Component<FeedViewProps, PageModel> {
    constructor(props: any){
        super(props);
        this.state = { } as PageModel;
    }

    componentDidMount() {
        this.props.presenter.initialize(this);
    }

    renderPage(model: PageModel) {
        this.setState(model);
    }

    render() {
        return (<div>
            <div>{this.state.date}</div>
            <p>{this.state.text}</p>
        </div>)
    }
}