var markers = [];
var infoWindows = [];
var map;
var directionsService;
var directionsDisplay;
var inputStart = /** @type {!HTMLInputElement} */ (
    document.getElementById('inputStart'));
var inputEnd = /** @type {!HTMLInputElement} */ (
    document.getElementById('inputEnd'));


// Reset markers, and routes.
$("#reset").click(function (event) {
    if(markers.length > 0)
    if (confirm("Reset markers?")) {
        if(markers[0])markers[0].setMap(null)
        if(markers[1])markers[1].setMap(null)

        markers = [];
        infoWindows = [];
        directionsDisplay.setMap(null);
        $('#right-panel').text("");
    }
});


//Init map, and start position
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: -26.4665992733309,
            lng: -49.11446034908295
        },
        zoom: 13
    });
    directionsService = new google.maps.DirectionsService;
    directionsDisplay = new google.maps.DirectionsRenderer({
        draggable: true,
        map: map,
        panel: document.getElementById('right-panel')
    });

    // Listen for clicks and add the location of the click to firebase.
    map.addListener('click', function (e) {
        document.getElementById("changetype-start").checked ?
            addMarker(new google.maps.LatLng(e.latLng.lat(), e.latLng.lng()), "Place start", 0) :
            addMarker(new google.maps.LatLng(e.latLng.lat(), e.latLng.lng()), "Place end", 1);
    });

    directionsDisplay.addListener('directions_changed', function () {
        computeTotalDistance(directionsDisplay.getDirections());
    });

    var types = document.getElementById('type-selector');
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(types);

    initAutoComplete();
}

// Call AutoComplete for inputs list places
function initAutoComplete() {
    setAutoComplete(inputStart, 0);
    setAutoComplete(inputEnd, 1);
}


// Set AutoComplete for inputs list places
function setAutoComplete(input, positionMarkerInArray) {
    var autocomplete = new google.maps.places.Autocomplete(input);
    autocomplete.bindTo('bounds', map);

    //When user put a data in input, this Listener is Activate
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

//Add marker in map
function addMarker(position, info, positionMarkerInArray) {
    directionsDisplay.setMap(map);
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

// Display route in map
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

// When the markers are moved, put the new address values in input
function computeTotalDistance(result) {
    console.log("change computeTotalDistance()", result);
    let myroute = result.routes[0];
    inputStart.value = myroute.legs[0].start_address;
    inputEnd.value = myroute.legs[0].end_address;
    // document.getElementById('total').innerHTML = myroute.legs[0].distance.text;
    // document.getElementById('time').innerHTML = myroute.legs[0].duration.text;
}