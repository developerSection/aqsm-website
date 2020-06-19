jQuery(function($) {
    // Asynchronously Load the map API 
    var script = document.createElement('script');
    script.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyDmlXP5feOB3s2A2c2RU6MTRdOouN3bcmE&callback=initMap";
    document.body.appendChild(script);
    });

    function initMap() {
    var today = new Date();
    var map;
    // var curr_location = {lat: 30.375320, lng: 69.345116}
    var bounds = new google.maps.LatLngBounds();
    var mapOptions = {
        mapTypeId: 'roadmap',
        zoom: 6,
    };
                    
    // Display a map on the page
    map = new google.maps.Map(document.getElementById("map_canvas"), {
        mapTypeId: 'roadmap',
        zoom: 1,
    });
    map.setTilt(45);
        
    // Multiple Markers
    var markers = [
        ['Anwar Chowk - Wah Cantt, Pakistan', 33.752247, 72.775554],
        ['Comsats University - Wah Cantt, Pakistan', 33.744914,72.787491],
        ['Liaq Ali Chowk - Wah Cantt, Pakistan', 33.765877,72.754441],
        ['Basti Chowk - Wah Cantt, Pakistan', 33.783133,72.723108],
    ];
    
    // Info Window Content
    var infoWindowContent = [
        ['<div class="info_content">' +
        '<h6>Anwar Chowk - Wah Cantt</h6>' +
        '<hr>'+
        '<button type="button" onclick="locAnwarChowk()">Click here for AQI info</button>'+
        '</div>' 
        ],
        ['<div class="info_content">' +
        '<h6>Comsats University - Wah Cantt</h6>' +
        '<hr>'+
        '<button type="button" onclick="locComsats()">Click here for AQI Info</button>'+
        '</div>' ]
    ];
        
    // Display multiple markers on a map
    var infoWindow = new google.maps.InfoWindow(), marker, i;
    
    // Loop through our array of markers & place each one on the map  
    for( i = 0; i < markers.length; i++ ) {
        var position = new google.maps.LatLng(markers[i][1], markers[i][2]);
        bounds.extend(position);
        marker = new google.maps.Marker({
            position: position,
            map: map,
            title: markers[i][0],
        });
        
        // Allow each marker to have an info window    
        google.maps.event.addListener(marker, 'click', (function(marker, i) {
            return function() {
                infoWindow.setContent(infoWindowContent[i][0]);
                infoWindow.open(map, marker);
            }
        })(marker, i));

        // Automatically center the map fitting all markers on the screen
        map.fitBounds(bounds);
    }

    // Override our map zoom level once our fitBounds function runs (Make sure it only runs once)
    var boundsListener = google.maps.event.addListener((map), 'bounds_changed', function(event) {
        this.setZoom(14);
        google.maps.event.removeListener(boundsListener);
    });
    
}
var locACdata = document.getElementById('locAC');
var locCUdata = document.getElementById('locCU');
var locACAQI = document.getElementById('locACAQI');
var locCUAQI = document.getElementById('locCUAQI');
function locAnwarChowk(){
    if(locACdata.style.display === 'none'){
        locACAQI.style.display = "block";
        locCUAQI.style.display = "none";
        locACdata.style.display = "block";
        locCUdata.style.display = "none";
    }
}
function locComsats(){
    if(locCUdata.style.display === 'none'){
        locACAQI.style.display = "none";
        locCUAQI.style.display = "block";
        locACdata.style.display = "none";
        locCUdata.style.display = "block";
    }
}