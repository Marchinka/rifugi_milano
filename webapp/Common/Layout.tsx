import React = require("react");

export default class Layout extends React.Component<{}> {

    render() {
        return (<div>
            <div className="app-content">
                {this.props.children}
            </div>
        </div>);    
    }

}