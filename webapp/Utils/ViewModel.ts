import Observer from "./Observer";

export interface ReadonlyViewModel<TEntity> {
    onModelChange(callback : (entity: TEntity) => void) : void;
    value: TEntity;
}

export default class ViewModel<TEntity>  implements ReadonlyViewModel<TEntity> {
    private _value: TEntity;
    private observer: Observer<TEntity> = new Observer<TEntity>();

    constructor(entity: TEntity = null) {
        if (entity != null) {
            this._value = entity;
        } else {
            this._value = {} as TEntity;
        }
    }

    get value(): TEntity {
        return this._value;
    }

    set value(value: TEntity) {
        this._value = value;
        this.observer.raise(value);
    }

    onModelChange(callback : (entity: TEntity) => void){
        this.observer.on(callback);
        if(this.value) {
            callback(this.value);
        }
    }

    unsuscribeAll() {
        this.observer.unsubscribeAll();
    }

    unsuscribe(callback : (entity: TEntity) => void) {
        this.observer.unsubscribe(callback);
    }
    
    update() {
        this.observer.raise(this._value);
    }
}
