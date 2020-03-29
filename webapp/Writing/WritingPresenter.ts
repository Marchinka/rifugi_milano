import { WritingView } from "./WritingView";
import { WritingModel } from "./WritingModel";
import { BasePresenter } from "../Common/BaseMVP";
import UserUtility from "../Common/UserUtility";

export class WritingPresenter extends BasePresenter<WritingView, WritingModel> {
    save(page: WritingModel, callback: () => void) {
        let contentJson = JSON.stringify(page.contents);
        let contentBase64 = btoa(contentJson);
        this.dao.send({
            url: "writing",
            method: "POST",
            data: {
                date: page.date,
                text: page.text,
                contents: contentBase64    
            },
            headers: UserUtility.getAuthenticationHeader()
        }, (response: any) => {
            let page = response.data.page;
            this.view.renderPage(page);
            callback();
        });
    }

    loadPage() {
        // if (pageId) {
        //     this.dao.send({
        //         url: "pages/" + pageId,
        //         method: "GET",
        //         headers: UserUtility.getAuthenticationHeader()
        //     }, (response: any) => {
        //         let page = response.data.page;
        //         this.view.renderPage(page);
        //     });
        // }
        // else {
            let page = {
                _id: null,
                text: "Write something epic..."
            } as WritingModel;
            this.view.renderPage(page);
        // }
    }    
}