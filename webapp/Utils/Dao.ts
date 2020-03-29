import Utils from './Utils';
import UserUtility from '../Common/UserUtility';
import RouteUtility from '../Common/RouteUtility';

export type HttpMethod =
  | 'get' | 'GET'
  | 'delete' | 'DELETE'
  | 'head' | 'HEAD'
  | 'options' | 'OPTIONS'
  | 'post' | 'POST'
  | 'put' | 'PUT'
  | 'patch' | 'PATCH'

// export class Dao {
//     baseUrl: string;

//     constructor(baseUrl: string) {
//         this.baseUrl = baseUrl;
//     }

//     send(options: DaoOptions, callback?: (response : any) => void) {
//         axios({
//             data: options.data,
//             method: options.method as Method,
//             url: Utils.urlCombine(this.baseUrl, options.url)
//         }).then(callback);
//     }
// }

declare var $: any;

export class Dao {
    baseUrl: string;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    send(options: DaoOptions, successCallback?: (response : any) => void, errorCallback?: (response : any) => void) {
        let url =Utils.urlCombine(this.baseUrl, options.url);

        $.ajax({
            url: url,
            data:  options.method == "GET" ? options.data : JSON.stringify(options.data),
            contentType: "application/json; charset=utf-8",
            method: options.method,
            cache: false,
            headers: options.headers
        }).done((responseFromServer :any) => {
            successCallback({
                data: responseFromServer
            });
        }).fail((response: any) => {     
            let isUnauthorized = response.status = 401;
            if (isUnauthorized) {
                console.log("Expired");
                UserUtility.clearToken();
                RouteUtility.goToLogin();
            }
            if(errorCallback) {
                errorCallback(response);
            }
        })
        .always(() => {     

        });
    }
}

export class DaoOptions {
    url: string;
    data?: any;
    method: HttpMethod;
    headers?: { [id: string] : string; };
}
