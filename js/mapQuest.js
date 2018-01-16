var mapsContainerData = new Vue({
  el: '#mapsContainer',
  data: {
    accuracy: 0,
    speed: 0,
    heading: 0
  }
});


L.mapquest.key = 'ItgV4yIhtPxpn3s4hBdHqIU5dupXO9WK';

var mapData = L.mapquest.map('map', {
  center: [-26.4665992733309, -49.11446034908295],
  layers: L.mapquest.tileLayer('map'),
  zoom: 12
});

mapData.addControl(L.mapquest.control());

// watch postion
var id, target, options;

function success(pos) {
  console.log("watch",pos)
  var crd = pos.coords;
  mapsContainerData.accuracy = crd.accuracy;
  mapsContainerData.heading = crd.heading;
  mapsContainerData.speed = crd.speed;

  // navigator.geolocation.clearWatch(id);

}

function error(err) {
  console.warn(`ERRO(' ${ err.code } '): ` + err.message);
}

target = {
  latitude : 0,
  longitude: 0
};

options = {
  enableHighAccuracy: true,
  timeout: 1000,
  maximumAge: 0
};

id = navigator.geolocation.watchPosition(success, error, options);