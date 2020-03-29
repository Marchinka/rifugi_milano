import { Spot } from "../Home/HomeModel";

declare var google : any;

let map : any;
let geocoder : any;
let clickEvents : any[] = [];
let tempMarker : any;
let markers :any[] = [];

var initMap = function () {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 45.469, lng: 9.154},
        zoom: 11
    });
    geocoder = new google.maps.Geocoder();

    // var locations = [
    //     {lat: 45.469, lng: 9.154}
    // ];

    // var markers = locations.map(function(location, i) {
    //     return new google.maps.Marker({
    //         position: location
    //     });
    // });

    // var markerCluster = new MarkerClusterer(
    //     map, 
    //     markers,  
    //     { 
    //         imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'
    //     });   

    google.maps.event.addListener(map, 'click', function(event: any) {
        clickEvents.forEach(function (f) {
            f(event);
        });
    });
}
var onClick = function (f: any) {
    clickEvents.push(f);
};
var placeTempMarker = function (location: any) {
    if (tempMarker) {
        tempMarker.setMap(null);
    }
    tempMarker = new google.maps.Marker({
        position: location,
        map: map
    });
};
var addMarker = function(spot: any) {
    var contentString = '<div id="content">'+
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
        map: map,
        position: {
            lat: spot.lat,
            lng: spot.lng
        }
    });
    
    marker.addListener('click', function() {
        infowindow.open(map, marker);
    });
    markers.push(marker);
};
var removeTempMarker = function () {
    if (tempMarker) {
        tempMarker.setMap(null);
    }
};
var getAddressPosition = function (address: any, callback: any) {
    geocoder.geocode({'address': address}, function (results: any, status: any) {
        if (status == google.maps.GeocoderStatus.OK) {
            if (status != google.maps.GeocoderStatus.ZERO_RESULTS) {
                callback({
                    hasResult: true,
                    location: results[0].geometry.location
                });

            } else {
                callback({
                    hasResult: false
                });
            }
        } else {
            callback({
                hasResult: false,
                message: "Geocode was not successful for the following reason: " + status
            });
        }
      });
};
var clear = function () {
    markers.forEach(function(m) {
        if (m) {
            m.setMap(null);
        }
    });
    markers = [];
};
// return {
//     initMap: initMap,
//     onClick: onClick,
//     placeTempMarker: placeTempMarker,
//     getAddressPosition: getAddressPosition,
//     removeTempMarker: removeTempMarker,
//     addMarker: addMarker,
//     clear: clear
// }

export interface MapOptions {
    mapId: string;
    center: Location;
    zoom: number;
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
            zoom: mapOptions.zoom //11
        });
        self.geocoder = new google.maps.Geocoder();
        self.tempMarker = null;
        self.markers = [];
        google.maps.event.addListener(map, 'click', (event: any) => {
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
            map: map
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
            map: map,
            position: {
                lat: spot.lat,
                lng: spot.lng
            }
        });
        
        marker.addListener('click', function() {
            infowindow.open(map, marker);
        });
        this.markers.push(marker);
    }

    removeTempMarker() {
        if (this.tempMarker) {
            this.tempMarker.setMap(null);
        }
    }

    getAddressPosition(address: string, callback: (e: GeocodeResponse) => void) {
        geocoder.geocode({'address': address}, function (results: any, status: any) {
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
        markers.forEach(function(m) {
            if (m) {
                m.setMap(null);
            }
        });
        markers = [];
    };
}