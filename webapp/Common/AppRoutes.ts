import { RouteId } from "../Utils/Magellan";

export class PageRoute extends RouteId {
    pageId: string;

    constructor(pageId: string) {
        super("Page");
        this.pageId = pageId;
    }
}

export class LoginRoute extends RouteId {
    message: string;

    constructor(message: string = "") {
        super("Login");
        this.message = message;
    }
}

// export class EditPageRoute extends RouteId {
//     pageId: string;

//     constructor(pageId: string) {
//         super("EditPage");
//         this.pageId = pageId;
//     }
// }