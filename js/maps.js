var markers = [];
var infoWindows = [];
var map;
var directionsService;
var directionsDisplay;
var inputStart = /** @type {!HTMLInputElement} */ (
    document.getElementById('inputStart'));
var inputEnd = /** @type {!HTMLInputElement} */ (
    document.getElementById('inputEnd'));

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: -33.8688,
            lng: 151.2195
        },
        zoom: 13
    });
    directionsService = new google.maps.DirectionsService;
    directionsDisplay = new google.maps.DirectionsRenderer({
        draggable: true,
        map: map,
        panel: document.getElementById('right-panel')
    });

    directionsDisplay.addListener('directions_changed', function () {
        computeTotalDistance(directionsDisplay.getDirections());
    });

    var types = document.getElementById('type-selector');
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(types);

    initAutoComplete();
}

function initAutoComplete() {
    setAutoComplete(inputStart, 0);
    setAutoComplete(inputEnd, 1);
}

function setAutoComplete(input, positionMarkerInArray) {
    var autocomplete = new google.maps.places.Autocomplete(input);
    autocomplete.bindTo('bounds', map);


    autocomplete.addListener('place_changed', function () {
        var place = autocomplete.getPlace();
        if (!place.geometry) {
            // User entered the name of a Place that was not suggested and
            // pressed the Enter key, or the Place Details request failed.
            window.alert("No details available for input: '" + place.name + "'");
            return;
        }

        // If the place has a geometry, then present it on a map.
        if (place.geometry.viewport) {
            map.fitBounds(place.geometry.viewport);
        } else {
            map.setCenter(place.geometry.location);
            map.setZoom(17); // Why 17? Because it looks good.
        }
        var address = '';
        if (place.address_components) {
            address = [
                (place.address_components[0] && place.address_components[0].short_name || ''),
                (place.address_components[1] && place.address_components[1].short_name || ''),
                (place.address_components[2] && place.address_components[2].short_name || '')
            ].join(' ');
        }
        addMarker(place.geometry.location, '<div><strong>' + place.name + '</strong><br>' + address, positionMarkerInArray);
    });
}

function addMarker(position, info, positionMarkerInArray) {
    if (!markers[positionMarkerInArray]) {
        var marker = new google.maps.Marker({
            map: map,
        });
        infoWindows[positionMarkerInArray] = new google.maps.InfoWindow();
        markers[positionMarkerInArray] = marker;
    }
    markers[positionMarkerInArray].setPosition(position);
    markers[positionMarkerInArray].setVisible(true);

    infoWindows[positionMarkerInArray].setContent(info);
    infoWindows[positionMarkerInArray].open(map, markers[positionMarkerInArray]);
    markers[positionMarkerInArray].addListener('click', function () {
        infoWindows[positionMarkerInArray].open(map, markers[positionMarkerInArray]);
    });
    if (markers.length > 1) {
        markers[0].setMap(null);
        markers[1].setMap(null);
        displayRoute();
    }
}

function displayRoute() {
    directionsService.route({
        origin: new google.maps.LatLng(markers[0].getPosition().lat(), markers[0].getPosition().lng()),
        destination: new google.maps.LatLng(markers[1].getPosition().lat(), markers[1].getPosition().lng()),
        travelMode: 'DRIVING',
        avoidTolls: true
    }, function (response, status) {
        if (status === 'OK') {
            console.log("change displayRoute()");
            directionsDisplay.setDirections(response);
        } else {
            alert('Could not display directions due to: ' + status);
        }
    });
}

function computeTotalDistance(result) {
    console.log("change computeTotalDistance()",result);
    let myroute = result.routes[0];
    inputStart.value = myroute.legs[0].start_address;
    inputEnd.value = myroute.legs[0].end_address;
    document.getElementById('total').innerHTML =  myroute.legs[0].distance.text;
    document.getElementById('time').innerHTML =  myroute.legs[0].duration.text;
}