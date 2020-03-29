import React = require("react");
import { NavigationComponent, Link } from "./Navigation";
import { Route, RouteId } from "./Magellan";
import { Dao } from "./Dao";
import Utils from "./Utils";
import Constants from "./Constants";
import ReactDOM = require("react-dom");
declare var $: any;

export interface InputChange {
    field: string;
    value: any;
    isUserChange: boolean;
}

export interface SelectOption {
    id: any;
    name: string;
}

interface InputProps {
    model: any;
    name: string;
    error?: string;
    disabled?: boolean;
    label: string;
    className?: string;
    onChange: (inputChange : InputChange) => void;
}

interface InputTextProps extends InputProps {
    isPassword? : boolean;
}

interface SelectProps extends InputProps {
    options: SelectOption[];
}

export class InputSelect extends React.Component<SelectProps> {
    id: number;

    constructor(props: any) {
        super(props);
    }

    componentDidMount() {
        this.setDefaultValue();
        this.initializePlugin();
    }

    componentDidUpdate() {
        let component = ReactDOM.findDOMNode(this);
        let $select = $(component).find("select");
        $select.trigger("chosen:updated");
    }
    
    private initializePlugin() {
        let component = ReactDOM.findDOMNode(this);
        let $select = $(component).find("select");
        $select.chosen({
            placeholder_text_single: "    "
        });
        let _this = this;
        $select.change(function (e: any) {
            _this.onChange(e);
        });
    }

    private setDefaultValue() {
        let component = ReactDOM.findDOMNode(this);
        let $select = $(component).find("select");
        let value = this.getValue();
        this.id = Math.random() * 10000;

        let hasValue = value;
        let hasOptions = (this.props.options || []).length > 0;
        
        if (!hasValue && hasOptions) {
            let firstValue = this.props.options[0];
            let inputChange = {
                field: this.props.name,
                value: firstValue.id,
                isUserChange: false
            } as InputChange;
            $select.trigger("chosen:updated");
            this.props.onChange(inputChange);
        }
    }
    onChange(e: any): void {
        let value = e.target.value;
        let inputChange = {
            field: this.props.name,
            value: value,
            isUserChange: true
        } as InputChange;
        this.props.onChange(inputChange);
    }

    getValue() : any {
        let value = this.props.model[this.props.name];
        if (value) {
            return value;
        } else {
            return "-1";
        }
    }

    private getInputId(): string {
        return this.props.name + "_" + this.id;
    }

    render() {
        return (<div className="field-container">
                <label htmlFor={this.getInputId()}>{this.props.label}</label>
                <select 
                    disabled={this.props.disabled}
                    placeholder=""
                    id={this.getInputId()} 
                    name={this.props.name} 
                    value={this.getValue() || ""}
                    onChange={e => this.onChange(e)}>
                    <option value={"-1"}></option>
                    {(this.props.options || []).map(option => {
                        return (<option key={option.id} value={option.id}>{option.name}</option>);
                    })}
                </select>
                <span className="message">{this.props.error}</span>
            </div>);
    }
}


export class InputText extends React.Component<InputTextProps> {
    id: number;

    constructor(props: any) {
        super(props);
        this.id = Math.random() * 10000;
    }

    componentDidMount() {
    }
    
    onChange(e: any): void {
        let value = e.target.value;
        let inputChange = {
            field: this.props.name,
            value: value,
            isUserChange: true
        } as InputChange;
        this.props.onChange(inputChange);
    }

    getValue() : any {
        let value = this.props.model[this.props.name];
        if (value == undefined || value == null) {
            return "";
        }
        return value;
    }

    private getInputId(): string {
        return this.props.name + "_" + this.id;
    }

    getFieldClass() {
        if (this.props.error) {
            return "invalid";
        } else {
            return "";
        }
    }

    render() {
        return (<div className={"field-container " + this.getFieldClass() + " " + this.props.className}>
                <label htmlFor={this.getInputId()}>{this.props.label}</label>
                <input 
                    autoComplete="off"
                    disabled={this.props.disabled}
                    type={this.props.isPassword ? "password" : "text"}
                    id={this.getInputId()} 
                    name={this.props.name} 
                    value={this.getValue()}
                    onChange={e => this.onChange(e)}
                />
                <span className="message">{this.props.error}</span>
            </div>);
    }
}

export class InputSearch extends React.Component<InputTextProps> {
    id: number;

    constructor(props: any) {
        super(props);
        this.id = Math.random() * 10000;
    }

    componentDidMount() {
    }
    
    onChange(e: any): void {
        let value = e.target.value;
        let inputChange = {
            field: this.props.name,
            value: value,
            isUserChange: true
        } as InputChange;
        this.props.onChange(inputChange);
    }

    getValue() : any {
        let value = this.props.model[this.props.name];
        if (value == undefined || value == null) {
            return "";
        }
        return value;
    }

    private getInputId(): string {
        return this.props.name + "_" + this.id;
    }

    getFieldClass() {
        if (this.props.error) {
            return "invalid";
        } else {
            return "";
        }
    }

    render() {
        return (<div className={"field-container input-search" + this.getFieldClass() + " " + this.props.className}>
                <label htmlFor={this.getInputId()}>{this.props.label}</label>
                <i className="search-icon fas fa-search"></i>
                <input 
                    autoComplete="off"
                    disabled={this.props.disabled}
                    type={this.props.isPassword ? "password" : "text"}
                    id={this.getInputId()} 
                    name={this.props.name} 
                    value={this.getValue()}
                    onChange={e => this.onChange(e)}
                />
                <span className="message">{this.props.error}</span>
            </div>);
    }
}

export class SquareInputColor extends React.Component<InputProps> {
    id: number;
    inputColor: HTMLInputElement;

    constructor(props: any) {
        super(props);
        this.id = Math.random() * 10000;
    }

    componentDidMount() {
    }
    
    onChange(e: any): void {
        let value = e.target.value;
        let inputChange = {
            field: this.props.name,
            value: value,
            isUserChange: true
        } as InputChange;
        this.props.onChange(inputChange);
    }

    getValue() : any {
        let value = this.props.model[this.props.name];
        return value;
    }

    private getInputId(): string {
        return this.props.name + "_" + this.id;
    }

    changeColor(e: React.ChangeEvent<HTMLInputElement>): void {
        let inputChange = {
            field: this.props.name,
            value: e.target.value,
            isUserChange: true
        } as InputChange;
        this.props.onChange(inputChange);
    }

    openInputColor(): void {
        this.inputColor.click();
    }

    getSpanColor(): React.CSSProperties {
        return { backgroundColor: this.getValue() }
    }

    render() {
        return (<div className="field-container">
                <input  type="color" 
                            style={{ display: "none"}}
                            onChange={(e) => this.changeColor(e)}
                            ref={node => this.inputColor= node}/>

                <span   className="color-button square" 
                        style={this.getSpanColor()}
                        onClick={() => this.openInputColor()}></span>
            </div>);
    }
}


export class InputColor extends React.Component<InputProps> {
    id: number;
    inputColor: HTMLInputElement;

    constructor(props: any) {
        super(props);
        this.id = Math.random() * 10000;
    }

    componentDidMount() {
    }
    
    onChange(e: any): void {
        let value = e.target.value;
        let inputChange = {
            field: this.props.name,
            value: value,
            isUserChange: true
        } as InputChange;
        this.props.onChange(inputChange);
    }

    getValue() : any {
        let value = this.props.model[this.props.name];
        return value;
    }

    private getInputId(): string {
        return this.props.name + "_" + this.id;
    }

    changeColor(e: React.ChangeEvent<HTMLInputElement>): void {
        let inputChange = {
            field: this.props.name,
            value: e.target.value,
            isUserChange: true
        } as InputChange;
        this.props.onChange(inputChange);
    }

    openInputColor(): void {
        this.inputColor.click();
    }

    getSpanColor(): React.CSSProperties {
        return { backgroundColor: this.getValue() }
    }

    render() {
        return (<div className="field-container">
                <label htmlFor={this.getInputId()}>{this.props.label}</label>
                <input 
                    autoComplete="off"
                    disabled={this.props.disabled}
                    type="text"
                    id={this.getInputId()} 
                    name={this.props.name} 
                    value={this.props.model[this.props.name] || ""}
                    onChange={e => this.onChange(e)}
                />
                <input  type="color" 
                            style={{ display: "none"}}
                            onChange={(e) => this.changeColor(e)}
                            ref={node => this.inputColor= node}/>

                <span   className="color-button" 
                        style={this.getSpanColor()}
                        onClick={() => this.openInputColor()}></span>
                        <span className="message">{this.props.error}</span>
            </div>);
    }
}



export class InputChoice extends React.Component<SelectProps> {
    id: number;

    constructor(props: any) {
        super(props);
    }

    componentDidMount() {
        
    }

    componentDidUpdate() {
        
    }

    getValue() : any {
        let value = this.props.model[this.props.name];
        if (value) {
            return value;
        } else if(this.props.options.length > 0) {
            return this.props.options[0].id;
        } else {
            return "-1";
        }
    }

    private getInputId(): string {
        return this.props.name + "_" + this.id;
    }

    getDisplayValue(): string {
        let displayValue = "";
        let value = this.getValue();
        this.props.options.forEach(o => {
            if (o.id == value) {
                displayValue = o.name;
            }
        });
        return displayValue;
    }

    
    changeValue(): void {
        let currentIndex = 0;
        let value = this.getValue();
        this.props.options.forEach((options, index) => {
            if (options.id == value) {
                currentIndex = index;
            }
        });

        let nextIndex = currentIndex + 1;
        if (nextIndex >= this.props.options.length) {
            nextIndex = 0;
        }

        if (this.props.options.length > 0) {
            var newOption = this.props.options[nextIndex];
            let inputChange = {
                field: this.props.name,
                value: newOption.id,
                isUserChange: true
            } as InputChange;
            this.props.onChange(inputChange);
        }
    }

    render() {
        return (<div className={"field-container " + this.props.className}>
                <label htmlFor={this.getInputId()}>{this.props.label}</label>
                <span unselectable="on" className="choice-container" onClick={() => this.changeValue()}>{this.getDisplayValue()}</span>
                <span className="message">{this.props.error}</span>
            </div>);
    }
}
