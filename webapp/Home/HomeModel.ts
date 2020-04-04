import { HomeMode } from "../Common/AppRoutes";

export interface HomeModel {
    spots: Spot[];
}

export interface Spot {
    _id: string;
    name: string;
    type: string;
    address: string;
    description: string;
    female: boolean;
    male: boolean;
    lat: number;
    lng: number;
    minAge: number;
    maxAge: number;
}


export interface HomeState extends HomeModel {
    selectedTypes: string[];
    selectedGenders: string[];
    searchText: string;
    age: string;
    mode: HomeMode;
}
