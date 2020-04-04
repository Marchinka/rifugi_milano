import { RouteId } from "../Utils/Magellan";

export type HomeMode =
  | 'landing' | 'list';

export class HomeRoute extends RouteId {
    mode: HomeMode;

    constructor(mode: HomeMode) {
        super("Home");
        this.mode = mode;
    }
}