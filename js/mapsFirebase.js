var markers = [];
var infoWindows = [];
var map;
var poly;
var config = {
  apiKey: "AIzaSyBOuBTkqGXG1GiOF_mGmkClOAak5fNTdX0",
  authDomain: "mapstest-7149e.firebaseapp.com",
  databaseURL: "https://mapstest-7149e.firebaseio.com",
  projectId: "mapstest-7149e",
  storageBucket: "mapstest-7149e.appspot.com",
  messagingSenderId: "546774782552"
};
var firebaseApp = firebase.initializeApp(config);
var db = firebaseApp.database();

var carIcon;
var carColor = "#df576a";
var footColor = "#0eb7f6";
var footIcon;
var s = [];
//Init map, and start position
function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: {
      lat: -26.2728305,
      lng: -48.8760667
    },
    zoom: 13
  });
}

var vmMyContainer = new Vue({
  el: "#myContainer",
  data: {
    trackerNumber: 0,
    dateId: "",
    allDataVm: []
  },
  firebase: function() {
    return {
      trackers: db.ref(`positions/`)
    };
  }
});
// Remove todos
// firebase.database().ref().child('positions').remove();
var allData = [];
var path = [];
var allValues = [];
function refFireFunctions() {
  vmMyContainer.allDataVm = [];
  polyRoute = [];
  markers = [];
  console.log(
    "refFireFunctions",
    `positions/${vmMyContainer.trackers[vmMyContainer.trackerNumber][".key"]}/${
      vmMyContainer.dateId
    }`
  );

  firebase
    .database()
    .ref(
      `positions/${
        vmMyContainer.trackers[vmMyContainer.trackerNumber][".key"]
      }/${vmMyContainer.dateId}`
    )
    .on("child_added", function(snapshot) {
      vmMyContainer.allDataVm.push(snapshot.val());

      var marker = new google.maps.Marker({
        position: new google.maps.LatLng(
          Number(snapshot.val().lat),
          Number(snapshot.val().lng)
        ),
        map: map,
        title: "Info"
      });
      var infowindow = new google.maps.InfoWindow({
        content: JSON.stringify(snapshot.val())
      });
      marker.addListener("click", function() {
        infowindow.open(map, marker);
      });
      markers.push(marker);
      allValues.push(snapshot.val());
      path.push(
        new google.maps.LatLng(
          Number(snapshot.val().lat),
          Number(snapshot.val().lng)
        )
      );
    });
}

function addPointsArray(array){
  array.forEach(element => {
    vmMyContainer.allDataVm.push(element);

    var marker = new google.maps.Marker({
      position: new google.maps.LatLng(
        Number(element.lat),
        Number(element.lng)
      ),
      map: map,
      title: "Info"
    });
    var infowindow = new google.maps.InfoWindow({
      content: JSON.stringify(element)
    });
    marker.addListener("click", function() {
      infowindow.open(map, marker);
    });
    markers.push(marker);
    allValues.push(element);
    path.push(
      new google.maps.LatLng(
        Number(element.lat),
        Number(element.lng)
      )
    );
  });

 
}
//       // console.log("ponto novo adicionado");
//       // console.log(snapshot.val());
//       // allValues.push(snapshot.val());
//       $("#myTable tr:last").after(`<tr>
//     <td>${snapshot.val().time}</td>
//     <td>{lat:${snapshot.val().lat},lng:${snapshot.val().lng}}</td>
//     <td>${snapshot.val().ignicao}</td>
//     <td>${snapshot.val().batteryState}</td>

//     <td>${snapshot.val().peopleMode}</td>
//     <td>${snapshot.val().speed}</td>
//     <td>${snapshot.val().satelites}</td>
//     <td>${snapshot.val().batteryLevel}</td>
//     <td>${snapshot.val().accuracy}</td>

//     </tr>`);
//       if (snapshot.val().ignicao === "0") {
//         addCircle(
//           new google.maps.LatLng(
//             Number(snapshot.val().lat),
//             Number(snapshot.val().lng)
//           )
//         );
//       }
//       // console.log(beforeMode, path);
//       if (snapshot.val().peopleMode != beforeMode) {
//         console.log(beforeMode, path);

//         if (beforeMode == 1) {
//           addLatLng(path, "green");
//         } else {
//           addLatLng(path, "blue");
//         }
//         if (path[path.length - 1]) {
//           var beforePoint = path[path.length - 1];
//           path = [];
//           path.push(beforePoint);
//           path.push(
//             new google.maps.LatLng(
//               Number(snapshot.val().lat),
//               Number(snapshot.val().lng)
//             )
//           );
//         } else {
//           path = [];
//         }
//       } else {
//         path.push(
//           new google.maps.LatLng(
//             Number(snapshot.val().lat),
//             Number(snapshot.val().lng)
//           )
//         );
//       }

//       beforeMode = snapshot.val().peopleMode;



//     });
// }

// Sets the map on all markers in the array.
function setMapOnAll(map) {
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(map);
  }
}

// Removes the markers from the map, but keeps them in the array.
function clearMarkers() {
  setMapOnAll(null);
}

// Shows any markers currently in the array.
function showMarkers() {
  setMapOnAll(map);
}

var markers = [];
var polyRoute;
function addLatLng(path, color) {
  // console.log(path);
  var colorVariable = ["white", "green", "blue", "yellow", "rose"];
  polyRoute = new google.maps.Polyline({
    path: path,
    map: map,
    strokeColor: color,
    geodesic: true,
    icons: [
      {
        icon: {
          path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
          // fillOpacity: 1,
          scale: 2
        },
        offset: "100%",
        repeat: "20px"
      }
    ]
  });
}

function removeLine() {
  polyRoute.setMap(null);
}
function cPoly(color) {
  poly = new google.maps.Polyline({
    map: map,
    strokeColor: color,
    geodesic: true,
    icons: [
      {
        icon: {
          path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
          scale: 2
        },
        offset: "100%",
        repeat: "20px"
      }
    ]
  });
}
function addCircle(latLng) {
  var cityCircle = new google.maps.Circle({
    strokeColor: "#FF0000",
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: "#FF0000",
    fillOpacity: 0,
    map: map,
    center: latLng,
    radius: 20
  });
}

function getFromFile() {
  $.each(dataJson2, function(key, val) {
    if (val.lat) {
      addFromFile(val);
    }
  });
}
var beforePoint;

function addFromFile(p) {
  console.log(p);

  if (p.ignicao === "0") {
    addCircle(new google.maps.LatLng(Number(p.lat), Number(p.lng)));
  }
  if (p.peopleMode != beforeMode) {
    if (beforeMode.lat) {
      if (beforeMode == 1) {
        cPoly("green");
        addLatLng2(beforePoint);
      } else {
        cPoly("blue");
        addLatLng2(beforePoint);
      }
    }
  }
  // if (p.peopleMode == 1) {
  //   cPoly("green");
  // } else {
  //   cPoly("red");
  // }
  beforePoint = new google.maps.LatLng(Number(p.lat), Number(p.lng));
  beforeMode = p.peopleMode;
  addLatLng2(new google.maps.LatLng(Number(p.lat), Number(p.lng)));
}
