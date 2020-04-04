import { Spot } from "../Home/HomeModel";

declare var window : any;

var google = window.google as any;

export interface MapOptions {
    mapId: string;
    center: Location;
    zoom: number;
    fullscreenControl: boolean;
    mapTypeControl: boolean;
    streetViewControl: boolean;
}

export interface Location {
    lat: number;
    lng: number;
}

export interface GeocodeResponse {
    hasResult: boolean;
    location?: Location;
    message?: string;
}

export class AppMap {
    private map : any;
    private geocoder : any;
    private clickEvents : ((event: any) => void)[] = [];
    private tempMarker : any;
    private markers :any[] = [];

    init(mapOptions: MapOptions) {
        const self = this;
        self.map = new google.maps.Map(document.getElementById(mapOptions.mapId), {
            center: mapOptions.center, //{lat: 45.469, lng: 9.154},
            zoom: mapOptions.zoom, //11,
            fullscreenControl: mapOptions.fullscreenControl,
            mapTypeControl: mapOptions.mapTypeControl,
            streetViewControl: mapOptions.streetViewControl
        });
        self.geocoder = new google.maps.Geocoder();
        self.tempMarker = null;
        self.markers = [];
        google.maps.event.addListener(self.map, 'click', (event: any) => {
            console.log("click on map", {
                lat: event.latLng.lat(),
                lng: event.latLng.lng()
            });
            self.clickEvents.forEach((func: (event: any) => void) => {
                func(event);
            });
        });
    }
    
    onClick(func: (event: any) => void) {
        this.clickEvents.push(func);
    }

    placeTempMarker(location: Location) {
        if (this.tempMarker) {
            this.tempMarker.setMap(null);
        }
        this.tempMarker = new google.maps.Marker({
            position: location,
            map: this.map
        });
    }

    addMarker(spot: Spot) {
        let contentString = '<div id="content">'+
        '<div id="siteNotice">'+
        '</div>'+
        '<h1 id="firstHeading" class="firstHeading">' + spot.name + '</h1>'+
        '<p><strong>Address</strong>: ' + spot.address +'</p>'+
        '<p><strong>Type</strong>: ' + spot.type +'</p>'+
        '<div id="bodyContent">'+
        '<p>' + spot.description +'</p>'+
        '</div>'+
        '</div>';
        var infowindow = new google.maps.InfoWindow({
            content: contentString
        });
        var marker = new google.maps.Marker({
            map: this.map,
            position: {
                lat: spot.lat,
                lng: spot.lng
            }
        });
        
        marker.addListener('click', function() {
            infowindow.open(this.map, marker);
        });
        this.markers.push(marker);
    }

    removeTempMarker() {
        if (this.tempMarker) {
            this.tempMarker.setMap(null);
        }
    }

    getAddressPosition(address: string, callback: (e: GeocodeResponse) => void) {
        this.geocoder.geocode({'address': address}, function (results: any, status: any) {
            if (status == google.maps.GeocoderStatus.OK) {
                if (status != google.maps.GeocoderStatus.ZERO_RESULTS) {
                    callback({
                        hasResult: true,
                        location: results[0].geometry.location
                    });
    
                } else {
                    callback({
                        hasResult: false,
                        message: null
                    });
                }
            } else {
                let message = "Geocode was not successful for the following reason: " + status;
                callback({
                    hasResult: false,
                    message: message
                });
            }
          });
    }

    clear() {
        this.markers.forEach(function(m) {
            if (m) {
                m.setMap(null);
            }
        });
        this.markers = [];
    };
}