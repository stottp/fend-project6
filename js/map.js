//to do

//1. hook up search direct to ko button
//2. use promises or call back to get results of api call
//3. Set error handlind on api call
//4. Declare 1 map instance and update it from everywhere
//5. Set markers in loop or wait until loop has finished
//6. Change colours of markers depending on category
//7. Have a month and date selector to choose
//8. Enhance the UX and UI
//9. Add geocode location for initial rendering and fall back to Stourbridge if not
//10 Get the filter to work and how it impacts the markers shown
//11. What is the list view?
//12. Click a marker displays unique information about it, maybe update DOM using ko
//14. Ensure 5 locations are used
//15. Update README to show where the api is being used
//16. Update README to include all the steps to get the application to run
//17. Add comments to code
//18. Check code on style guide and run it through lint et al
//19. Last 5 seached dropdown, on click reperforms the search, maybe need to store lat lng in it too
//20. Advanced - On map move, redraw the markers
//21. On mobile capturing press enter
//22. Remove the event listener and bind it to ko
//23. Only select one toggle bounce


// does this need to be a ko.observableArray?
var markers = [];

var init = function initMap() {
    var menu = document.querySelector('#menu');
    var main = document.querySelector('main');
    var drawer = document.querySelector('#drawer');


    var map = new google.maps.Map(document.getElementById('map'), {
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

    // Utilise google maps Autocomplete functionality on search
    var locationAutocomplete = new google.maps.places.Autocomplete(
        document.getElementById('location'));

        // remove this and bind it to knockout
        document.getElementById('search-btn').addEventListener('click', function() {
            geocode(map);
        });

        // add event listener for menu
        menu.addEventListener('click', function(e) {
        drawer.classList.toggle('open');
        e.stopPropagation();
        });

        main.addEventListener('click', function() {
        drawer.classList.remove('open');
      });
    }

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
            resultsMap.setCenter(results[0].geometry.location);
            lat = (results[0].geometry.location.lat());
            lng = (results[0].geometry.location.lng());

            //put the lat lng in an observable
            appViewModel.lat = lat;
            appViewModel.lng = lng;
            console.log(lat, lng);
            console.log(resultsMap);
            //bounds.extend(resultsMap.setCenter(results[0].geometry.location));
    } else {
      window.alert('Geocode was not successful for the following reason: ' + status);
    }
  });
}

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
      }

// adds a 5 second bounce animation to markers when they are clicked
var makemarkerbounce = function makeMarkerBounce(marker) {
    if (marker.getAnimation() !== null) {
          marker.setAnimation(null);
        } else {
            marker.setAnimation(google.maps.Animation.BOUNCE);
            setTimeout(function() {
                marker.setAnimation(null)
            }, 5000);
        }
        alert('I have clicked on marker' + marker.title)
    }
