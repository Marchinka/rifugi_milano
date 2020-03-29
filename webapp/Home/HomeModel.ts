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