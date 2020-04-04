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

export class SpotRoute extends RouteId {
  id: string;

    constructor(id: string) {
        super("Spot");
        this.id = id;
    }
}