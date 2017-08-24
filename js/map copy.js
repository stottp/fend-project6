//to do

//2. Add markers
//3. link ajax response to dom via view model

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
          zoomControl: false,
          //zoomControlOptions: {position: google.maps.ControlPosition.RIGHT_BOTTOM}
          zoomControlOptions: {position: google.maps.ControlPosition.TOP_RIGHT}
    });
  var geocoder = new google.maps.Geocoder();

  var locationAutocomplete = new google.maps.places.Autocomplete(
      document.getElementById('location'));

// remove this and bind it to knockout
  document.getElementById('search-btn').addEventListener('click', function() {
      geocode(geocoder, map);
  });
}

var geocode = function geocodeAddress(geocoder, resultsMap) {
  var address = document.getElementById('location').value;
  var geocoder = new google.maps.Geocoder();
  geocoder.geocode({'address': address}, function(results, status) {
    if (status === 'OK') {
      resultsMap.setCenter(results[0].geometry.location);
      lat = (results[0].geometry.location.lat());
      lng = (results[0].geometry.location.lng());


      //put the lat lng in an observable
      appViewModel.lat = lat;
      appViewModel.lng = lng;
      console.log(lat, lng);

      var locationsarraytest = [getcrimesold(lat, lng, 2017-01)];
      console.log(locationsarray);

      var locationsarray = [
          {location: {lat: 52.440460, lng: -2.122233}},
          {location: {lat: 52.423930, lng: -2.127922}},
         {location: {lat: 52.429010, lng: -2.126967}},
          {location: {lat: 52.432283, lng: -2.108370}},
         {location: {lat: 52.423935, lng: -2.131408}}
      ]

      for (var i = 0; i < locationsarray.length; i++) {
          var position = locationsarray[i].location;

          var marker = new google.maps.Marker({
              map: resultsMap,
              position: position,
              id: i
          });
          markers.push(marker);
          console.log(markers);
      }

      // To add the marker to the map, call setMap();
      marker.setMap(resultsMap);

      var markerCluster = new MarkerClusterer(resultsMap, markers);

      //get the address name to populate last 5 searches

      //var markers = new google.maps.Marker({
        //map: resultsMap,
        //position: results[0].geometry.location
      //});
    } else {
      window.alert('Geocode was not successful for the following reason: ' + status);
    }
  });
}

var getcrimesold = function getCrimesDataold(lat, lng, date) {
    var crimeUrlTest = 'https://data.police.uk/api/crimes-street/all-crime?lat=52.4199&lng=-2.14521&date=2017-01';
    var crimeUrl = 'https://data.police.uk/api/crimes-street/all-crime?lat=' + lat + '&lng=' + lng + '&date=2017-01';
    var lat = lat;
    var lng = lng;
    var date = 2017-01;
    console.log(crimeUrl);

    $.getJSON(crimeUrl, function (data) {
        console.log(data);
        appViewModel.crimeResults(data);
        crimes = data;
    })
}
