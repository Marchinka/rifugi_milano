import { FeedView } from "./FeedView";
import { FeedItem, FeedModel } from "./FeedModel";
import { BasePresenter } from "../Common/BaseMVP";
import UserUtility from "../Common/UserUtility";

export class FeedPresenter extends BasePresenter<FeedView, FeedModel> {
    loadFeeds() {
        this.view.showLoader();
        this.dao.send({
            url: "pages",
            method: "GET",
            headers: UserUtility.getAuthenticationHeader()
        }, (response: any) => {
            setTimeout(() => {
                let feedModel = {} as any;
                feedModel.feedItems = response.data.pages;
                this.view.renderFeed(feedModel);
                this.view.hideLoader();
            }, 4 * 1000);
        });
    }
    
}