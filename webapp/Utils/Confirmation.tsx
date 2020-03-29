import React = require("react");
import { PopUp, PopUpController } from "./PopUp";

interface Props {
    confirm: Confirm;
    popupController: PopUpController;
}

interface ConfirmationState {
    text: string;
    yes: string;
    no: string;
    onDeny?: () => void;
    onConfirmation?: () => void; 
}

export class Confirm {
    private popupController: PopUpController;

    constructor(popupController: PopUpController) {
        this.popupController = popupController;
    }

    that(text: string) : YesChain {
        return new YesChain({
            text: text
        } as ConfirmationState, this.popupController);
    }
}

class YesChain {
    state: ConfirmationState;
    popupController: PopUpController;

    constructor(state: ConfirmationState, popupController: PopUpController) {
        this.state = state;
        this.popupController = popupController;
    }

    yes(yes: string, onConfirmation?: () => void) {
        this.state.yes = yes;
        this.state.onConfirmation = onConfirmation;
        return new NoChain(this.state, this.popupController);
    }

    ask() {
        this.popupController.openPopUp(this.state);
    }
}

class NoChain {
    state: ConfirmationState;
    popupController: PopUpController;

    constructor(state: ConfirmationState, popupController: PopUpController) {
        this.state = state;
        this.popupController = popupController;
    }

    no(no: string, onDeny?: () => void) {
        this.state.no = no;
        this.state.onDeny = onDeny;
        return new NoChain(this.state, this.popupController);
    }

    ask() {
        this.popupController.openPopUp(this.state);
    }
}

// confirm.that("Are you sure you want to delete this project?")
//     .yes("Yes")
//     .orNo("No")
//     .open();

export class Confirmation extends React.Component<Props, ConfirmationState> {

    constructor (props :any) {
        super(props);
        this.state = {} as ConfirmationState;
    }

    componentDidMount() {
        this.props.popupController.onOpen.on((state: ConfirmationState) => {
            this.setState(state);
        });
    }

    confirm(): void {
        if (this.state.onConfirmation) {
            this.state.onConfirmation();
        }
        this.props.popupController.closePopUp();
    }

    deny(): void {
        if (this.state.onDeny) {
            this.state.onDeny();
        }
        this.props.popupController.closePopUp();
    }

    render() {
        return (<PopUp popupController={this.props.popupController}>
            <p>
                {this.state.text}
            </p>
            <hr />
            <div className="confirmation-footer">
                <button onClick={() => this.deny()}><strong>{this.state.no || "No"}</strong></button>
                <button onClick={() => this.confirm()}><strong>{this.state.yes || "Yes"}</strong></button>
            </div>
        </PopUp>);
    }
}