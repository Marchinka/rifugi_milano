import React = require("react");
import ViewModel from "./ViewModel";
import { InputChange } from "./Inputs";
import { PopUpController, PopUp } from "./PopUp";

interface ListComponentProps<TEntity, TQueryObject> {
    viewModel: ViewModel<TEntity[]>;
    controller: ListController<TEntity, TQueryObject>;
    title: string;
}

interface ListComponentState<TEntity, TQueryObject> {
    list: TEntity[];
    inputElement: TEntity;
    queryObject: TQueryObject;
}

export interface ListController<TEntity, TQueryObject> {
    copy(entity: TEntity, callback: () => void) : void;
    createNew(callback: (entityId: any) => void) : void;
    search(filters: TQueryObject) : void;
    delete(inputElement: TEntity, callback: () => void): void;
    save(inputElement: TEntity, callback: () => void) :void;
}

export abstract class ListComponent<TEntity, TQueryObject> extends 
React.Component<ListComponentProps<TEntity, TQueryObject>, ListComponentState<TEntity, TQueryObject>> {
    popUpcontroller: PopUpController;
    
    constructor(props: any) {
        super(props);
        this.state = {
            list: [],
            inputElement: {},
            queryObject: {}
        } as ListComponentState<TEntity, TQueryObject>;
        this.popUpcontroller = new PopUpController();
    }
  
    componentDidMount() {
        this.props.viewModel.onModelChange(list => {
            this.setState({
                list: list
            });
        });
    }

    onQueryObjectChange(e: InputChange): void {
        let queryObject = this.state.queryObject as any;
        queryObject[e.field] = e.value;
        this.setState({
            queryObject: queryObject
        });
    }

    onInputObjectChange(e: InputChange): void {
        let inputElement = this.state.inputElement as any;
        inputElement[e.field] = e.value;
        this.setState({
            inputElement: inputElement
        });
    }

    abstract renderSearchForm() : JSX.Element;

    abstract renderItem(entity: TEntity): JSX.Element;
    
    search(e : any): void {
        e.preventDefault();
        this.props.controller.search(this.state.queryObject);
    }

    abstract renderInputForm(): JSX.Element;

    openUpdateForm(entity: TEntity) {
        this.setState({
            inputElement: JSON.parse(JSON.stringify(entity))
        }, () => {
            this.popUpcontroller.openPopUp();
        });
    }

    openCreationForm() {
        let emptyState = {} as any;
        for(let key in this.state.inputElement) {
            emptyState[key] = null;
        }
        this.setState({
            inputElement: this.getEmptyEntity() as TEntity
        }, () => {
            this.openUpdateForm({} as TEntity);
        });
    }

    getEmptyEntity(): TEntity {
        return {} as TEntity;
    }

    save(): void {
        this.props.controller.save(this.state.inputElement, () => {
            this.popUpcontroller.closePopUp();
            this.fullRefresh();
        });
    }

    fullRefresh() {
        let emptyState = {
            list: [],
            inputElement: {},
            queryObject: {}
        } as ListComponentState<TEntity, TQueryObject>;
        this.setState(emptyState, () => {
            this.props.controller.search(this.state.queryObject);
        });
    }

    delete(): void {
        this.props.controller.delete(this.state.inputElement, () => {
            this.popUpcontroller.closePopUp();
            this.fullRefresh();
        });
    }

    hideIfNew(): React.CSSProperties {
        let obj = this.state.inputElement as any;
        let hasId = obj.id || obj._id;
        if (hasId) {
            return {}
        } else {
            return { display: "none" };
        }
    }

    createEntity(): void {
        this.openCreationForm();
    }

    mainRender() { 
        return (<div className="generalContainer">
                    <h2 className="home-title">{this.props.title}</h2>
                    <h2 className="home-sub-title">FILTER BY: </h2>
                    <form onSubmit={(e) => this.search(e)} className="clearfix">
                        {this.renderSearchForm()}
                        <button className="home-button"><i className="fas fa-search"></i> Search</button>
                        <button className="home-button" type="button" onClick={() => this.createEntity()}><i className="fas fa-plus"></i> Create</button>
                    </form>
                    <div className="projectContainer"><div className="row">
                        {(this.state.list || []).map((entity => {
                            return this.renderItem(entity);
                        }), this)}
                    </div>
                </div>
            </div>)
    }

    render() {
        return (<div>
            {this.mainRender()}
            <PopUp popupController={this.popUpcontroller}>
                {this.renderInputForm()}
                <button className="margin-top-30px" onClick={() => this.delete()}>
                    <strong><i className="far fa-trash-alt"></i> Delete</strong>
                </button>
                <button className="margin-top-30px floatRight" onClick={() => this.save()}>
                    <strong><i className="far fa-save"></i> Save</strong>
                </button>
            </PopUp>
        </div>);
    }
}