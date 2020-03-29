import { PageView } from "./PageView";
import { PageModel } from "./PageModel";
import { BasePresenter } from "../Common/BaseMVP";
import UserUtility from "../Common/UserUtility";

export class PagePresenter extends BasePresenter<PageView, PageModel> {
    loadPage(pageId: string) {
        this.dao.send({
            url: "pages/" + pageId,
            method: "GET",
            headers: UserUtility.getAuthenticationHeader()
        }, (response: any) => {
            let page = response.data.page;
            this.view.renderPage(page);
        });
    }    
}