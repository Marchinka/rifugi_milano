import React = require("react");

interface Props {
    show: boolean;
}

export class MuthLoader extends React.Component<Props> {

    constructor (props :any) {
        super(props);
    }


    getLoaderStyle() {
        if (this.props.show) {
            return {};
        } else {
            return { display: "none" };
        }
    }

    render() {
        return (<div className="w3-container muth-loader" style={this.getLoaderStyle()}>
        <div className="w3-padding w3-center">
            <img className="w3-circle w3-amber muth-image" src="images/muth.png" alt="avatar" />
        </div>
    </div>);
    }
}