var mapsContainerData = new Vue({
  el: "#mapsContainer",
  data: {
    accuracy: 0,
    speed: 0,
    heading: 0
  }
});
var L;
var lastCrdw = [];
var trackCenter = false;
var enableTrackCenter = false;
L.mapquest.key = "ItgV4yIhtPxpn3s4hBdHqIU5dupXO9WK";

var mapData = L.mapquest.map("map", {
  center: [-26.4665992733309, -49.11446034908295],
  layers: L.mapquest.tileLayer("map"),
  zoom: 12
});

mapData.addControl(L.mapquest.control());
mapData.addEventListener("move", eventRaised);
mapData.addEventListener("moveend", eventRaised);
var currentLocation = L.marker([-26.4665992733309, -49.11446034908295], {
  icon: L.mapquest.icons.marker(),
  draggable: false
}).addTo(mapData);

// log events below
function eventRaised(evt) {
  var en = evt.type;
  if (en === "move") {
    if (evt.originalEvent) {
      trackCenter = false;
      document.getElementById("recenterBtn").disabled = false;
    } else {
    }
  }
  if (en === "moveend") {
    if (enableTrackCenter) {
      trackCenter = true;
      enableTrackCenter = false;
      document.getElementById("recenterBtn").disabled = true;
      mapData.setZoom(16);
    }
  }
}







// --- watch postion --- \\
var id,
  target,
  options,
  notFoundInitLocation = true;

function success(pos) {
  console.log("watch", pos);
  var crd = pos.coords;
  lastCrdw = crd;
  mapsContainerData.accuracy = crd.accuracy;
  mapsContainerData.heading = crd.heading;
  mapsContainerData.speed = crd.speed;
  // navigator.geolocation.clearWatch(id); // stop watch
  currentLocation.setLatLng([crd.latitude, crd.longitude]);
  if (trackCenter) {
    mapData.panTo([crd.latitude, crd.longitude]);
  }


  
  if (notFoundInitLocation) {
    initDirection(crd);
  }
  notFoundInitLocation = false;
}

function recenter() {
  enableTrackCenter = true;
  mapData.flyTo([lastCrdw.latitude, lastCrdw.longitude]);
}

function initDirection(crd) {
  L.mapquest.directions().route({
    start: [crd.latitude, crd.longitude],
    end: [-26.276394099999997, -48.8749733]
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


// Recenter Button
L.Control.Watermark = L.Control.extend({
  onAdd: function(mapData) {
    // Set CSS for the control border.
    var controlUI = document.createElement("div");
    controlUI.style.backgroundColor = "#fff";
    controlUI.style.border = "2px solid #fff";
    controlUI.style.borderRadius = "3px";
    controlUI.style.boxShadow = "0 2px 6px rgba(0,0,0,.3)";
    controlUI.style.cursor = "pointer";
    controlUI.style.marginBottom = "22px";
    controlUI.style.textAlign = "center";
    controlUI.title = "Click to recenter the map";

    // Set CSS for the control interior.
    var controlButton = document.createElement("button");
    controlButton.id = "recenterBtn";
    controlButton.className = "btn btn-info";
    controlButton.type = "button";
    controlButton.style.fontFamily = "Roboto,Arial,sans-serif";
    controlButton.style.fontSize = "16px";
    controlButton.innerHTML = "Re-Center";
    controlUI.appendChild(controlButton);

    // Setup the click event listeners: simply set the map to Chicago.
    controlButton.addEventListener("click", function() {
      recenter();
    });

    return controlUI;
  },

  onRemove: function(mapData) {
    // Nothing to do here
  }
});

L.control.watermark = function(opts) {
  return new L.Control.Watermark(opts);
};

L.control.watermark({ position: "bottomright" }).addTo(mapData);
