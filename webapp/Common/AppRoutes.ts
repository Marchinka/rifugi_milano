import { RouteId } from "../Utils/Magellan";

export type HomeMode =
  | 'landing' | 'list';

export type MapMode =
    | 'open' | 'closed';

export class HomeRoute extends RouteId {
    mode: HomeMode;
    mapMode: MapMode;

    constructor(mode: HomeMode, mapMode: MapMode) {
        super("Home");
        this.mode = mode;
        this.mapMode = mapMode;
    }
}

export class SpotRoute extends RouteId {
  id: string;

    constructor(id: string) {
        super("Spot");
        this.id = id;
    }
}