import React = require("react");
import { FeedPresenter } from "./FeedPresenter";
import { FeedItem, FeedModel } from "./FeedModel";
import { Link } from "../Utils/Navigation";
import { PageRoute } from "../Common/AppRoutes";
import { RouteId } from "../Utils/Magellan";
import Utils from "../Utils/Utils";

interface FeedViewProps {
    presenter: FeedPresenter;
}


export interface FeedState extends FeedModel {
    showLoader: boolean;
}

export class FeedView extends React.Component<FeedViewProps, FeedState> {
    constructor(props: any){
        super(props);
        this.state = { feedItems: [], showLoader: true };
    }

    componentDidMount() {
        this.props.presenter.initialize(this);
    }

    showLoader() {
        this.setState({ showLoader: true });
    }

    hideLoader() {
        this.setState({ showLoader: false });
    }

    renderFeed(model: FeedState) {
        this.setState(model);
    }

    render() {
        return (<div className="feed">
            <h1 className="main-title">
                <span className="text-color4">R</span>
                <span>ose</span>
                &nbsp;
                <span className="text-color4">C
                </span><span>afé</span>
            </h1>
            <div style={Utils.shoIf(this.state.showLoader)}>
                <FeedItemSkeleton feedItem={null} />
                <FeedItemSkeleton feedItem={null} />
                <FeedItemSkeleton feedItem={null} />
                <FeedItemSkeleton feedItem={null} />
                <FeedItemSkeleton feedItem={null} />
                <FeedItemSkeleton feedItem={null} />
                <FeedItemSkeleton feedItem={null} />
                <FeedItemSkeleton feedItem={null} />
                <FeedItemSkeleton feedItem={null} />
                <FeedItemSkeleton feedItem={null} />
            </div>
            <div style={Utils.shoIf(!this.state.showLoader)}>
                {(this.state.feedItems || []).map(feedItem => {
                    return (<FeedItemView key={feedItem._id} feedItem={feedItem}/>)
                }, this)}
            </div>
            <div style={Utils.shoIf(!this.state.showLoader)}>
                <Link route={new RouteId("Writing")} className="btn new-page-button">
                    <i className="fas fa-plus fa-2x"></i>
                </Link>
            </div>
            <div className="space-buffer">{/*To avoid button overlay*/}</div>
        </div>)
    }
}

interface ItemProps {
    feedItem: FeedItem;
}

abstract class BaseFeedItemView extends React.Component<ItemProps> {

    abstract getViewModel() : FeedItem;
    abstract getFeedItemClass(): string;
    
    getInitialLetter() {
        let text = this.getViewModel().text || "";
        if (text.length > 0) {
            return text.charAt(0);
        }
        return "";
    }
    
    getText() {
        let text = this.getViewModel().text || "";
        if (text.length > 0) {
            return text.substring(1);
        }
        return "";
    }

    render() {
        return (<Link route={new PageRoute(this.getViewModel()._id)} className={"feed-item " + this.getFeedItemClass()}>
                    <div className="icon">
                        <div className="image-text">{this.getViewModel().date}</div>
                        <div className="round-img">
                            <img src={this.getViewModel().writerIcon} />
                        </div>
                        <div className="image-text">{this.getViewModel().writerName}</div>
                    </div>
                    <div className="content">
                        <p className="feed-item-text">
                            <span className="firstcharacter">{this.getInitialLetter()}</span>
                            {this.getText()}
                        </p>
                    </div>
                </Link>)
    }
}

class FeedItemView extends BaseFeedItemView {
    getFeedItemClass() {
        return "";
    }

    getViewModel() {
        return {
            _id: this.props.feedItem._id,
            text: this.props.feedItem.text,
            date: this.props.feedItem.date,
            writerIcon: this.props.feedItem.writerIcon || "./images/base-user-icon.png",
            writerName: this.props.feedItem.writerName || "Username"
        } as FeedItem;
    }
}

class FeedItemSkeleton extends BaseFeedItemView {
    getFeedItemClass() {
        return "skeleton";
    }
    
    getViewModel() {
        return {
            writerIcon: ""
        } as FeedItem;
    }
}