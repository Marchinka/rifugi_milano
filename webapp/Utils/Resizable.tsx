import React = require("react");

interface Props {
    className?: string;
    minWidth?: number;
    width?: number;
    onWidthChange?: (px: number) => void;
}

interface State {
    dragging: boolean;
}

export default class Resizable extends React.Component<Props, State> {
    container: HTMLDivElement;
    draggable: HTMLDivElement;
    originalWidth: number;

    constructor(props: Props) {
        super(props);
        this.state = { dragging: false };
    }

    render() {
        return (<div className={this.getClass()} ref={node => this.container = node}>
            <div className="draggable" ref={node => this.draggable = node}></div>
            {this.props.children}
        </div>);
    }

    getWidth(text: string): number {
        let cssWidth = text;
        let width = parseInt(cssWidth.replace("px", ""));
        return width;
    }

    componentDidMount() {
        if (this.props.width) {
            let cssWidth = (this.props.width || this.props.minWidth) + "px";
            this.container.style.width = cssWidth;
        } else {
            let cssWidth = this.props.minWidth + "px";
            this.container.style.width = cssWidth;
        }
        this.originalWidth = this.getWidth(this.container.style.width);

        let resize = (e: any) => {
            let width = e.pageX - this.container.getBoundingClientRect().left;
            if (width < this.props.minWidth) {
                return;
            }
            let cssWidth = width + "px";
            this.container.style.width = cssWidth;
        };

        this.draggable.addEventListener("mousedown", e => {
            e.preventDefault();
            window.addEventListener("mousemove", resize);
            window.addEventListener("mouseup", e => {
                let cssWidth = this.container.style.width;
                let width = this.getWidth(cssWidth);
            
                if (this.props.onWidthChange && width != this.originalWidth) {
                    this.props.onWidthChange(width);
                }
                window.removeEventListener("mousemove", resize);
                this.originalWidth = width;
            });
        });
    }

    private getClass(): string {
        return "resizable " + (this.props.className || "");
    }
}