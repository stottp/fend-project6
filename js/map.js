// does this need to be a ko.observableArray?
var markers = [];


var init = function initMap() {
    var menu = document.querySelector('#menu');
    var main = document.querySelector('main');
    var drawer = document.querySelector('#drawer');


    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 15,
        center: {lat: 52.678419, lng: -2.445257999999967},
        mapTypeControl: true,
        mapTypeControlOptions: {
            style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
            position: google.maps.ControlPosition.TOP_RIGHT
          },
          scrollwheel: false,
          zoomControl: true,
          //zoomControlOptions: {position: google.maps.ControlPosition.RIGHT_BOTTOM}
          zoomControlOptions: {position: google.maps.ControlPosition.TOP_RIGHT}
    });

     var infoWindow = new google.maps.InfoWindow();



    // Try HTML5 geolocation.
        /*if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(function(position) {
            var pos = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };

            infoWindow.setPosition(pos);
            infoWindow.setContent('Location found.');
            infoWindow.open(map);
            map.setCenter(pos);
          }, function() {
            handleLocationError(true, infoWindow, map.getCenter());
          });
        } else {
          // Browser doesn't support Geolocation
          handleLocationError(false, infoWindow, map.getCenter());
      } */

        function handleLocationError(browserHasGeolocation, infoWindow, pos) {
        infoWindow.setPosition(pos);
        infoWindow.setContent(browserHasGeolocation ?
                              'Error: The Geolocation service failed.' :
                              'Error: Your browser doesn\'t support geolocation.');
        infoWindow.open(map);
      }

    // Utilise google maps Autocomplete functionality on search
    var locationAutocomplete = new google.maps.places.Autocomplete(
        document.getElementById('location'));

        // remove this and bind it to knockout
    //    document.getElementById('search-btn').addEventListener('click', function() {
    //        geocode(map);
    //    });


        // Capture enter key and run the geocode map function
        document.getElementById("form-container").onkeypress = function(e) {
            var key = e.charCode || e.keyCode || 0;
            if (key == 13) {
                e.preventDefault();
                console.log('Enter has been pressed');
                geocode(map);
            }
        };

        // add event listener for menu
        menu.addEventListener('click', function(e) {
        drawer.classList.toggle('open');
        e.stopPropagation();
        });

        document.getElementById('menu-close').addEventListener('click', function(e) {
        drawer.classList.remove('open');
        e.stopPropagation();
        });

        main.addEventListener('click', function() {
        drawer.classList.remove('open');
      });

      appViewModel.lat = 52.678419;
      appViewModel.lng = -2.445257999999967;

      getcrimes(appViewModel.lat, appViewModel.lng , 2017-03);
  };

// use google Geocode to get the address of a searched location
var geocode = function geocodeAddress() {

    var resultsMap = new google.maps.Map(document.getElementById('map'), {
        zoom: 15,
        center: {lat: 52.397, lng: -2.43},
        mapTypeControl: true,
        mapTypeControlOptions: {
            style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
            position: google.maps.ControlPosition.TOP_RIGHT
          },
          scrollwheel: false,
          zoomControl: true,
          //zoomControlOptions: {position: google.maps.ControlPosition.RIGHT_BOTTOM}
          zoomControlOptions: {position: google.maps.ControlPosition.TOP_RIGHT}
    });

    var address = document.getElementById('location').value;
    var bounds = new google.maps.LatLngBounds();
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({'address': address}, function(results, status) {
        if (status === 'OK') {

            markers.length = 0;
            appViewModel.crimeMarkers  = 0;

            resultsMap.setCenter(results[0].geometry.location);
            lat = (results[0].geometry.location.lat());
            lng = (results[0].geometry.location.lng());

            //put the lat lng in an observable
            appViewModel.lat = lat;
            appViewModel.lng = lng;
            //bounds.extend(resultsMap.setCenter(results[0].geometry.location));

            getcrimes(lat, lng, 2017-03);

    } else {
      window.alert('Geocode was not successful for the following reason: ' + status);
    }
  });
};

var poplateinfowindow = function populateInfoWindow(marker, infowindow) {
    // Check to make sure the infowindow is not already opened on this marker.
    if (infowindow.marker != marker) {
        infowindow.marker = marker;
        infowindow.setContent('<div>' + marker.title + '</div>');
        infowindow.open(map, marker);
        // Make sure the marker property is cleared if the infowindow is closed.
        infowindow.addListener('closeclick', function() {
            infowindow.marker = null;
          });
        }
      };

// adds a 5 second bounce animation to markers when they are clicked
var makemarkerbounce = function makeMarkerBounce(marker) {
    if (marker.getAnimation() !== null) {
          marker.setAnimation(null);
        } else {
            marker.setAnimation(google.maps.Animation.BOUNCE);
            setTimeout(function() {
                marker.setAnimation(null);
            }, 5000);
        }
        alert('I have clicked on marker' + marker.title);
    };
