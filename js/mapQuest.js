var mapsContainerData = new Vue({
  el: "#mapsContainer",
  data: {
    accuracy: 0,
    speed: 0,
    heading: 0
  }
});
var L;
L.mapquest.key = "ItgV4yIhtPxpn3s4hBdHqIU5dupXO9WK";

var mapData = L.mapquest.map("map", {
  center: [-26.4665992733309, -49.11446034908295],
  layers: L.mapquest.tileLayer("map"),
  zoom: 12
});

mapData.addControl(L.mapquest.control());

var currentLocation = L.marker([-26.4665992733309, -49.11446034908295], {
  icon: L.mapquest.icons.marker(),
  draggable: false
})
  .bindPopup("Denver, CO")
  .addTo(mapData);

// watch postion
var id, target, options, notFoundInitLocation = true;

function success(pos) {
  console.log("watch", pos);
  var crd = pos.coords;
  mapsContainerData.accuracy = crd.accuracy;
  mapsContainerData.heading = crd.heading;
  mapsContainerData.speed = crd.speed;
  // navigator.geolocation.clearWatch(id);
  currentLocation.setLatLng([crd.latitude, crd.longitude]);
  mapData.setView([crd.latitude, crd.longitude]);
  mapData.setZoom(17);
  if(notFoundInitLocation){
    initDirection(crd);
  }
  notFoundInitLocation = false;
}

function initDirection(crd) {
  L.mapquest.directions().route({
    start: [crd.latitude, crd.longitude],
    end: [-26.276394099999997,-48.8749733]
  });
}


function error(err) {
  console.warn(`ERRO(' ${err.code} '): ` + err.message);
}

target = {
  latitude: 0,
  longitude: 0
};

options = {
  enableHighAccuracy: true,
  timeout: 1000,
  maximumAge: 0
};

id = navigator.geolocation.watchPosition(success, error, options);
