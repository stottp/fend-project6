var map;
var bounds;
var markers = [];


/* Initial funciton called async on google map load. it creates and sets the map
and adds markers to the map for a default location, Telford in England
*/
var init = function initMap() {
    // declare the responisve menu variable
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
      zoomControlOptions: {position: google.maps.ControlPosition.TOP_RIGHT}
});
    var bounds = new google.maps.LatLngBounds();
    var infoWindow = new google.maps.InfoWindow();

    // Utilise google maps Autocomplete functionality on search
    var locationAutocomplete = new google.maps.places.Autocomplete(
        document.getElementById('location'));

    //add the markers to the map
    for (var i = 0; i < viewmodel.crimes().length; i++) {
        var marker = new google.maps.Marker({
            map: map,
            position: viewmodel.crimes()[i].location(),
            title: viewmodel.crimes()[i].category() + viewmodel.crimes()[i].crimeId(),
            animation: google.maps.Animation.DROP
        });
        // adds marker to crimes
        viewmodel.crimes()[i].marker = marker;
        markers.push(marker);
        bounds.extend(marker.position);

        // adds functionality to markers
    //    viewmodel.crimes()[i].marker.addListener('click', function() {
    //        poplateinfowindow(this, largeInfoWindow);
    //        makemarkerbounce(this);
    //    });
    }

    map.addListener(markers, 'click', function() {
        poplateinfowindow(this, largeInfoWindow);
        makemarkerbounce(this);
    });


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
};


/*
use google Geocode to get the address of a searched location from the
text box called location on the index.html page
*/
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

    // could potentially use ko value
    var address = document.getElementById('location').value;
    var bounds = new google.maps.LatLngBounds();
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({'address': address}, function(results, status) {
        if (status === 'OK') {

            markers.length = 0;
            //viewmodel.crimes  = 0;

            resultsMap.setCenter(results[0].geometry.location);
            lat = (results[0].geometry.location.lat());
            lng = (results[0].geometry.location.lng());

            //put the lat lng in an observable
            viewmodel.lat = lat;
            viewmodel.lng = lng;

            viewmodel.getcrimes(lat, lng, 2017-06);

            viewmodel.last5Searches();

    } else {
      window.alert('Geocode was not successful for the following reason: ' + status);
    }
  });
};


// set up crime
var Crime = function(data) {
    this.category = ko.observable(data.category);
    this.crimeId = ko.observable(data.id);
    this.location = ko.observable(data.location);
    this.street = ko.observable(data.location.street.name);
    if (data.outcome_status !== null) {
        this.outcome_status = ko.observable(data.outcome_status.category);
    } else {
        this.outcome_status = ko.observable();
    }
};

var updatemarkers = function updateCrimeMarkers() {
    var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 15,
    // error handling check array size
    center: {lat: Number(viewmodel.crimes()[0].location().latitude), lng: Number(viewmodel.crimes()[0].location().longitude)},
    mapTypeControl: true,
    mapTypeControlOptions: {
        style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
        position: google.maps.ControlPosition.TOP_RIGHT
      },
      scrollwheel: false,
      zoomControl: true,
      zoomControlOptions: {position: google.maps.ControlPosition.TOP_RIGHT}
});
    var bounds = new google.maps.LatLngBounds();
    var largeInfoWindow = new google.maps.InfoWindow();

    for (var i = 0; i < viewmodel.crimes().length; i++) {
        var crimeCategory = viewmodel.crimes()[i].category();
        var crimeID = viewmodel.crimes()[i].crimeId();
        var crimeLat = Number(viewmodel.crimes()[i].location().latitude);
        var crimeLng = Number(viewmodel.crimes()[i].location().longitude);

        // Crime locations
        var crimePosition = {lat: crimeLat, lng: crimeLng};

        var marker = new google.maps.Marker({
            map: map,
            position: crimePosition,
            id: crimeID,
            title: crimeCategory,
            animation: google.maps.Animation.DROP
        });

        // adds marker to crimes array
        viewmodel.crimes()[i].marker = marker;

        // Add the crime locations to the map
        markers.push(marker);

        // Extend the boundries of the map for each marker
        bounds.extend(marker.position);
    }

    map.addListener(markers, 'click', function() {
        poplateinfowindow(this, largeInfoWindow);
        makemarkerbounce(this);
    });

    // Add the markers to the map through setMap;
    map.fitBounds(bounds);
    //marker.setMap(map);

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
    };



// this removes crime markers based on the selected dropdown
var removecrimemarkers = function removeCrimeMarkers() {

    var bounds = new google.maps.LatLngBounds();
    var largeInfoWindow = new google.maps.InfoWindow();
    var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 15,
    mapTypeControl: true,
    mapTypeControlOptions: {
        style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
        position: google.maps.ControlPosition.TOP_RIGHT
      },
      scrollwheel: false,
      zoomControl: true,
      zoomControlOptions: {position: google.maps.ControlPosition.TOP_RIGHT}
});

    // need to sort out the markers and the array
    for (var i = 0; i < markers.length; i++ ) {
        if (markers[i].title !== viewmodel.selectedCategory()) {
            markers[i].setMap(null);
        } else {
            // Extend the boundries of the map for each marker
            bounds.extend(markers[i].position);
            map.fitBounds(bounds);
            markers[i].setMap(map);
        }
    }
    map.addListener(markers, 'click', function() {
        poplateinfowindow(this, largeInfoWindow);
        makemarkerbounce(this);
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


// setup ViewModel
var ViewModel = function() {
    // Data
    var self = this;

    // store a list of all crimes
    this.crimes = ko.observableArray();

    // keep track of the current crime
    this.currentCrime = ko.observable();

    // get search location
    this.locationName = ko.observable();

    // keep track of the last 5 searches
    this.last5Searches = ko.observableArray();

    // adds a header to the crimes list
    this.listOfCrimes = ko.observable();

    //add last 5 locations to drop dropdown
    this.lastFive = function() {
        // check to see if a location has been searched for
        if(self.locationName())
        // check to see if location already exists in array
        if(self.last5Searches().indexOf(self.locationName()) === -1)
            this.last5Searches.push(this.locationName());
            // maximum of 5 locaations allowed in array
            if(self.last5Searches().length > 5)
                self.last5Searches().shift();
        };


    // get a list of crimes from police api
    this.getcrimes = function getCrimesData(lat, lng, date) {
        var crimeUrl = 'https://data.police.uk/api/crimes-street/all-crime?lat=' + lat + '&lng=' + lng + '&date' + date;

        // create new instances of crimes and add them to the crimesarray
       $.getJSON(crimeUrl, function(allData) {
        var mappedCrime = $.map(allData, function(item) {
            return new Crime(item);
        });
        self.crimes(mappedCrime);
    })
    .fail(function(e) {
        alert('Sorry there was an error selecting the data, please try again');
    })
    .always(function() {
        // output to say the ajax request was a success
        updatemarkers();
    });
    };

    // Load initial data from api
    $.getJSON("https://data.police.uk/api/crimes-street/all-crime?lat=52.678419&lng=-2.445257999999967&date=2017-03", function(allData) {
        var mappedCrime = $.map(allData, function(item) {
            return new Crime(item);
        });
        self.crimes(mappedCrime);
    })
    .fail(function(e) {
        alert('Sorry there was an error selecting the data, please try again');
    })
    .always(function() {
        // output to say the ajax request was a success
        updatemarkers();
    });

    // Update the current crime
    this.currentCrimeClick = function(clickedCrime) {
        self.currentCrime(clickedCrime);
        makemarkerbounce(clickedCrime.marker);
        self.listOfCrimes("List of crimes");
    };

    // Just extract the categories from data
    this.justCategories =ko.computed(function() {
        var categories = ko.utils.arrayMap(self.crimes(), function(item) {
            return item.category();
        });
        return categories.sort();
    });

    // Just extract the locations from data
    this.justLocations =ko.computed(function() {
        var locations = ko.utils.arrayMap(self.crimes(), function(item) {
            return item.locations;
        });
        return locations.sort();
    });

    // Get unique categories from justCategories function
    this.uniqueCategories = ko.dependentObservable(function() {
        return ko.utils.arrayGetDistinctValues(self.justCategories()).sort();
    });

    // Captures the selected category
    this.selectedCategory = ko.observable();

    // filters the markers based on the selectedCategory - *** this is the function to filter the markers ***
    this.filterMarker = ko.computed(function() {
        if ((self.selectedCategory() !== undefined)) {
            // filter the markers
            removecrimemarkers();
            }
        return; //add something here;
    });

    // Searches for location and returns markers
   this.knockoutSearch = function() {
       geocode();
       self.lastFive();
   };
};

var viewmodel = new ViewModel();

// Activates knockout.js
ko.applyBindings(viewmodel);

// catch erorrs
function mapError() {
    alert("Google Maps failed to load... Please try again");
}
