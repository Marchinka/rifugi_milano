export default class Observer<TEventArguments> {

    private callbacks: ((args: TEventArguments) => void)[];

    constructor() {
        this.callbacks = [];
    }

    on(callback: ((args: TEventArguments) => void)) {
        this.callbacks.push(callback);
    }

    raise(args: TEventArguments) {
        this.callbacks.map((callback) => {
            callback(args);
        });
    }

    unsubscribeAll() {
        this.callbacks = [];
    }

    unsubscribe(callback : ((args: TEventArguments) => void)) {
        let pre = this.callbacks.length;
        this.callbacks.splice(this.callbacks.indexOf(callback), 1 );
        console.log("unsubscribe", pre, " -> ", this.callbacks.length);
    }
}