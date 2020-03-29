import { Dao } from "../Utils/Dao";
import React = require("react");

export abstract class BasePresenter<TView, TModel> {
    protected model: TModel;
    protected view: TView;
    protected dao: Dao;

    constructor() {
        this.dao = new Dao("/");
    }

    initialize(view: TView) {
        this.view = view;
    }
}