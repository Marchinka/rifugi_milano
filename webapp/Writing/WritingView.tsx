import React = require("react");
import { WritingPresenter } from "./WritingPresenter";
import { WritingModel } from "./WritingModel";
import { Magellan, RouteId } from "../Utils/Magellan";

interface EditPageViewProps {
    presenter: WritingPresenter;
}

declare var Quill: any;

interface FontModel {
    name: string;
    label?: string;
}

export class WritingView extends React.Component<EditPageViewProps, WritingModel> {
    quill: any;

    constructor(props: any){
        super(props);
        this.state = { } as WritingModel;
    }

    getFonts() : FontModel[] { // se si vuole modificare la lista dei font va aggiornato anche il foglio di stile Writing.scss
        return [
            { name: "helvetica" },
            { name: "verdana" },
            { name: "arial" },
            { name: "times", label: "Times New Roman" },
            { name: "georgia" },
            { name: "courier" },
            { name: "impact" },
        ];
    }

    componentDidMount() {
        var FontAttributor = Quill.import('formats/font');
        var fonts = this.getFonts().map(f => f.name);
        FontAttributor.whitelist = fonts;
        Quill.register(FontAttributor, true);
        this.quill = new Quill('#editor', {
            modules: {
                toolbar: {container: "#toolbar-container"}
            },
            placeholder: 'Compose an epic...',
            theme: 'snow'
        });
        this.props.presenter.initialize(this);
    }

    renderPage(page: WritingModel) {
        this.setEditorContent("");
        this.setState(page, () => {
            let html = page.text;
            this.setEditorContent(html);
        });
    }

    private setEditorContent(html: string) {
        this.quill.setText(html);
    }

    save(): void {
        let page = this.state as WritingModel;
        let contents = this.quill.getContents();
        console.log("contents", contents);
        page.text = this.quill.getText();
        page.date = "2020-02-20"; // TODO TOGLIERE
        page.contents = contents;
        this.props.presenter.save(page, () => {
            Magellan.get().goTo(new RouteId("Feed"));
        });
    }

    render() {
        return (<div>
            <button type="button" onClick={() => this.save()}>Save</button>
            <div id="toolbar-container">
                <button className="ql-bold"></button>
                <button className="ql-italic"></button>
                <button className="ql-underline"></button>

                <button className="ql-blockquote"></button>
                
                <select className="ql-font">
                    {this.getFonts().map((f, i) => {
                        return (<option value={f.name}>{f.label || f.name}</option>);
                    })}
                </select>
                <button className="ql-script"></button>
            </div>
            <div id="editor"></div>
            <button type="button" onClick={() => this.save()}>Save</button>
        </div>)
    }
}