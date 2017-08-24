//to do

//1. hook up search direct to ko button
//2. use promises or call back to get results of api call
//3. Set error handlind on api call
//4. Declare 1 map instance and update it from everywhere
//5. Set markers in loop or wait until loop has finished
//6. Change colours of markers depending on category of crime
//7. Have a month and date selector
//8. Make the app responsive

var markers = [];

var init = function initMap() {
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
    }

// use google Geocode to get the address of a searched location
var geocode = function geocodeAddress(resultsMap) {
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
