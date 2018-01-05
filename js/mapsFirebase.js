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
firebase.initializeApp(config);




//Init map, and start position
function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: {
      lat: -26.4665992733309,
      lng: -49.11446034908295
    },
    zoom: 13
  });

  var lineSymbol = {
    path: google.maps.SymbolPath.CIRCLE,
    fillOpacity: 1,
    scale: 3
  };
  poly = new google.maps.Polyline({
    strokeColor: "#0eb7f6",
    strokeOpacity: 0,
    fillOpacity: 0,
    icons: [
      {
        icon: lineSymbol,
        offset: "0",
        repeat: "10px"
      }
    ]
  });
  poly.setMap(map);

  // map.addListener('click', addLatLng);
  refFireFunctions();
}

function refFireFunctions(){
  firebase.database().ref('positions').on('child_added', function(snapshot) {
    $('#myTable tr:last').after(`<tr>
    <td>${snapshot.val().time}</td>
    <td>{lat:${snapshot.val().lat},lng:${snapshot.val().lng}}</td>

    <td>${snapshot.val().ignicao}</td>
    <td>${snapshot.val().speed}</td>
    <td>${snapshot.val().satelites}</td>
    <td>${snapshot.val().bateryLevel}</td>
    <td>${snapshot.val().accuracy}</td>
    
    </tr>`);

    if(snapshot.val().ignicao === "0"){
      addCircle(new google.maps.LatLng(Number(snapshot.val().lat), Number(snapshot.val().lng)));
    }
    addLatLng(new google.maps.LatLng(Number(snapshot.val().lat), Number(snapshot.val().lng)));
    
    console.log("ponto novo adicionado");
    console.log(snapshot.val());
    // addMarkerManual(snapshot.val().lat, snapshot.val().lng);
  });
}

function addLatLng(latLng) {
    var path = poly.getPath();
    // Because path is an MVCArray, we can simply append a new coordinate
    // and it will automatically appear.
    path.push(latLng);

    // Add a new marker at the new plotted point on the polyline.
    // var marker = new google.maps.Marker({
    //   position: latLng,
    //   title: '#' + path.getLength(),
    //   map: map
    // });
}
function addCircle(latLng) {
    var cityCircle = new google.maps.Circle({
        strokeColor: '#FF0000',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#FF0000',
        fillOpacity: 0,
        map: map,
        center: latLng,
        radius: 20
      }); 
}

