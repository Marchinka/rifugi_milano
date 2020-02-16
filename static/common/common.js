var mapp = (function () {
    var map;
    var geocoder;
    var clickEvents = [];
    var tempMarker;
    var markers = [];

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
    

        google.maps.event.addListener(map, 'click', function(event) {
            clickEvents.forEach(function (f) {
                f(event);
            });
        });
    }

    var onClick = function (f) {
        clickEvents.push(f);
    };

    var placeTempMarker = function (location) {
        if (tempMarker) {
            tempMarker.setMap(null);
        }

        tempMarker = new google.maps.Marker({
            position: location,
            map: map
        });
    };

    var addMarker = function(spot) {
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

    var getAddressPosition = function (address, callback) {
        geocoder.geocode({'address': address}, function (results, status) {
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

    return {
        initMap: initMap,
        onClick: onClick,
        placeTempMarker: placeTempMarker,
        getAddressPosition: getAddressPosition,
        removeTempMarker: removeTempMarker,
        addMarker: addMarker
    }
})();

var utils = (function() {
    var serializeForm = function($form) {
        var values = $form.serializeArray();
        var result = {};
                
        values.forEach(function (val) {
            result[val.name] = val.value;           
        });
        return result;
    };

    var ajax = function(options, callback) {
        $.ajax({
            url: options.url,
            data:  options.method == "GET" ? options.data : JSON.stringify(options.data),
            contentType: "application/json; charset=utf-8",
            method: options.method,
            cache: false
        }).done(function(resp) {
            callback(resp);
        }).always(() => {
                       
        });
    };

    return {
        serializeForm: serializeForm,
        ajax: ajax
    };
})();

var RM = {
    mapp: mapp,
    utils: utils
};