let serializeObject = (obj: any) => {
    let serialization = "";
    let useConcatenation = false;

    for (let key in obj) {
        let member = obj[key];
        if(typeof member === "function") {
            continue;
        }
        let value = (member || "").toString();
        if (useConcatenation) {
            serialization += "&";
        }
        let delta = key + "=" + value;
        let encodedDelta = encodeURI(delta);
        serialization += encodedDelta;
        useConcatenation = true;
    }
    return serialization;
};

class RouteCallbacks {
    callbacksDictionary: { [id: string] : ((parameters : any) => void)[]};

    constructor() {
        this.callbacksDictionary = {} as { [id: string] : ((parameters : any) => void)[]};
    }

    add(routeId: string, callback : (parameters : any) => void) : void {
        let id = (routeId || "");
        if(!this.callbacksDictionary[id]){
            this.callbacksDictionary[id] = [];
        }

        this.callbacksDictionary[id].push(callback);
    }

    get(routeId: string) : ((parameters : any) => void)[] {
        let id = (routeId || "");
        if(!this.callbacksDictionary[id]){
            return [];
        }

        return this.callbacksDictionary[id];
    }

    getAllExcept(routeId :string) : ((parameters : any) => void)[] {
        let callbacks = [] as ((parameters : any) => void)[];
        for (let key in this.callbacksDictionary) {
            if (key != routeId) {
                callbacks = callbacks.concat(this.get(key));
            }
        }
        return callbacks;
    }
}

export abstract class Route {
    abstract getRouteId(): string;
    
    getFragement(): string {
        let _this = this as any;
        let data = {} as any;
        for(let key in _this) {
            data[key] = _this[key];
        }
        
        return serializeObject(data);
    }
}

export class ConcreteRoute extends Route {
    data: any;
    
    constructor(data:any = {}) {
        super();
        this.data = data;
        let _this = this as any;
        for(let key in data) {
            _this[key] = data[key];
        }
    }

    getRouteId() {
        return this.data.routeId;
    }
}

export class RouteId extends Route {

    private routeId :string;

    getRouteId(): string {
        return this.routeId
    }

    constructor(route: string) {
        super();
        this.routeId = route;
    }
} 

export enum Mode {
    Hash,
    History,
    SessionStorage,
    LocalStorage,
}

export class Magellan {

    private static instance: Magellan;
    private static mode: Mode = Mode.Hash;

    private defaultRoute: Route;
    private routeCallbacks : RouteCallbacks;
    private negativeCallbacks : RouteCallbacks;
    private intervalId: number;
    private currentFragment: string;

    private constructor() {
        this.routeCallbacks = new RouteCallbacks();
        this.negativeCallbacks = new RouteCallbacks();
    }
    
    public get mode() : string {
        return this.mode;
    }

    static get(): Magellan {
        if (!this.instance) {
            this.instance = new Magellan();
        }

        return this.instance;
    }

    start() {
        this.checkRoute(true);
        this.intervalId = setInterval(() => {
            this.checkRoute();
        }, 50);
    }

    stop() {
        clearInterval(this.intervalId);
    }
    
    setDefaultRouteId(routeId: string) {
        this.defaultRoute = new RouteId(routeId);
    }
    
    setDefault(defaultRoute: Route) {
        this.defaultRoute = defaultRoute;
    }

    getCurrentRoute<T>(): T {
        var fragment = this.getFragment();
        var routeObject = this.deserializeFragment(fragment);
        var route = new ConcreteRoute(routeObject) as any;
        return route as T;
    }

    private checkRoute(force : boolean = false) {
        var fragment = this.getFragment();   
        if(force || fragment !== this.currentFragment) {
            var routeObject = this.deserializeFragment(fragment);            
            let routeId = routeObject.routeId || routeObject.routeid;
            let callbacksToExecute = this.routeCallbacks.get(routeId);
            let oldFragment = this.currentFragment;
            this.currentFragment = fragment;

            callbacksToExecute.map((callback) => {
                try {
                    callback(routeObject);
                } catch (e) {
                    console.error(e);
                }
            });

            let negativeCallbacks = this.negativeCallbacks.getAllExcept(routeId);

            negativeCallbacks.map((callback) => {
                try {
                    callback(routeObject);
                } catch (e) {
                    console.error(e);
                }
            });

            // console.log("Magellan", {
            //     oldFragment: oldFragment,
            //     currentFragment: this.currentFragment,
            //     callbacksToExecute: callbacksToExecute.length,
            //     negativeCallbacks: negativeCallbacks.length,
            //     activateDefault: callbacksToExecute.length == 0
            // });

            const noCallbackExecuted = callbacksToExecute.length == 0 && negativeCallbacks.length != 0;
            const emptyFragment = !this.currentFragment;
            if(noCallbackExecuted || emptyFragment) {
                this.goTo(this.defaultRoute);
            }
        }     
    }

    private deserializeFragment(fragment: string) : any {
        let obj = {} as any;
        let parts = fragment.split("&");
        parts.map((part) => {
            var items = part.split("=");
            if(items.length >= 2) {
                let key = items[0];
                let value = items[1];
                let decodedKey = decodeURI(key);
                let decodedValue = decodeURI(value);
                obj[decodedKey] = decodedValue;
            }
        });
        return obj;
    }

    on<T extends Route>(type: (new () => T), callback: (route : T) => void) : void {
        let instance = new type();
        let routeId = instance.getRouteId();

        if(!routeId) {
            console.error("A route implementation must have a default route Id specification");
            return;
        }

        this.routeCallbacks.add(routeId, (obj) => {
            callback(obj as T);
        });
    }

    onRouteId(routeId: string, callback: (params : any) => void) : void {
        this.routeCallbacks.add(routeId, (obj) => {
            callback(callback);
        });
    }

    
    notOn<T extends Route>(type: (new () => T), callback: (route : T) => void, isDefault :boolean = false) : void {
        let instance = new type();
        let routeId = instance.getRouteId();

        if(!routeId) {
            console.error("A route implementation must have a default route Id specification");
            return;
        }

        this.negativeCallbacks.add(routeId, (obj) => {
            callback(obj as T);
        });
    }

    notOnRouteId(routeId: string, callback: (params : any) => void, isDefault :boolean = false) : void {
        this.negativeCallbacks.add(routeId, (obj) => {
            callback(callback);
        });
    }

    goTo<T>(route : T)  : void {
        let fragment = this.serializeObject(route);
        this.setFragment(fragment);
    }

    private serializeObject(obj : any) :string {
        return serializeObject(obj);
    }

    private getFragment() : string {
        switch (Magellan.mode) {
            case Mode.Hash:
                let match = window.location.href.match(/#(.*)$/);
                let fragment = match ? match[1] : '';
                return fragment;
            case Mode.History:
                break;
            case Mode.LocalStorage:
                return (localStorage.getItem("Magellan_fragement") || "");
            case Mode.SessionStorage:
                return (sessionStorage.getItem("Magellan_fragement") || "");
        } 
    }

    private setFragment(fragment: string) {
        switch (Magellan.mode) {
            case Mode.Hash:
                window.location.hash = fragment;
                break;
            case Mode.History:
                break;
            case Mode.LocalStorage:
                localStorage.setItem("Magellan_fragement", fragment);
                break;
            case Mode.SessionStorage:
                sessionStorage.setItem("Magellan_fragement", fragment);
                break;
        } 
    }
}