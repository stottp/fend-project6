// define global variables
var map;
var bounds;
var largeInfoWindow;
var infoWindow;
var markers = [];


/* Initial funciton called async on google map load. it creates and sets the map
* and adds markers to the map for a default location, Telford in England
*/
var init = function initMap() {
    // declare the responisve menu variable
    var menu = document.querySelector('#menu');
    var main = document.querySelector('main');
    var drawer = document.querySelector('#drawer');

    // create the map
    bounds = new google.maps.LatLngBounds();
    largeInfoWindow = new google.maps.InfoWindow();
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 15,
        mapTypeControl: true,
        mapTypeControlOptions: {
            style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
            position: google.maps.ControlPosition.TOP_RIGHT
        },
        scrollwheel: false,
        zoomControl: true,
        zoomControlOptions: {
            position: google.maps.ControlPosition.TOP_RIGHT
        }
    });

    infoWindow = new google.maps.InfoWindow();

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

        // adds functionality to markers
        addmarkerfunction(i);

        // add marker to crimes
        viewmodel.crimes()[i].marker = marker;

        // add markers and update bounds
        markers.push(marker);
        bounds.extend(marker.position);
    }

    /*
    // Capture enter key and run the geocode map function
    document.getElementById("form-container").onkeypress = function(e) {
        var key = e.charCode || e.keyCode || 0;
        if (key == 13) {
            e.preventDefault();
            console.log('Enter has been pressed');
            geocode(map);

        }
    }; */

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

    // ensure map resizes on window resize
    google.maps.event.addDomListener(window, 'resize', function() {
        map.fitBounds(bounds); //
    });
};


// Add functionality to markers
var addmarkerfunction = function addMarkerFunction(i) {
    viewmodel.crimes()[i].marker.addListener('click', function() {
        poplateinfowindow(this, largeInfoWindow);
        makemarkerbounce(this);
    });
};


var geocode = function geocodeAddress() {
    var address = viewmodel.locationName();
    var geocoder = new google.maps.Geocoder();

    //reset bounds of the map
    bounds = new google.maps.LatLngBounds();

    geocoder.geocode({
        'address': address
    }, function(results, status) {
        if (status === 'OK') {
            markers.length = 0;
            map.setCenter(results[0].geometry.location);
            lat = (results[0].geometry.location.lat());
            lng = (results[0].geometry.location.lng());

            //put the lat lng in an observable
            viewmodel.lat = lat;
            viewmodel.lng = lng;
            viewmodel.getcrimes(lat, lng, 2017 - 06);
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
    for (var i = 0; i < viewmodel.crimes().length; i++) {
        var crimeCategory = viewmodel.crimes()[i].category();
        var crimeID = viewmodel.crimes()[i].crimeId();
        var crimeLat = Number(viewmodel.crimes()[i].location().latitude);
        var crimeLng = Number(viewmodel.crimes()[i].location().longitude);

        // Crime locations
        var crimePosition = {
            lat: crimeLat,
            lng: crimeLng
        };

        var marker = new google.maps.Marker({
            map: map,
            position: crimePosition,
            id: crimeID,
            title: crimeCategory,
            animation: google.maps.Animation.DROP
        });

        // adds marker to crimes array
        viewmodel.crimes()[i].marker = marker;

        // adds functionality to markers
        addmarkerfunction(i);

        // Add the crime locations to the map
        markers.push(marker);

        // Extend the boundries of the map for each marker
        bounds.extend(marker.position);
    }

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


// show all markers in the array
var showallmarkers = function showAllMarkers() {
    for (var i = 0; i < markers.length; i++) {
        bounds.extend(markers[i].position);
        map.fitBounds(bounds);
        markers[i].setMap(map);
    }
};


// show all markers in the array
var removeallmarkers = function removeAllMarkers() {
    for (var i = 0; i < markers.length; i++) {
        console.log(markers.length);
        bounds.extend(markers[i].position);
        map.fitBounds(bounds);
        markers[i].setMap(null);
        markers = [];
        console.log(markers.length);
    }
};

// this removes crime markers based on the selected dropdown
var removecrimemarkers = function removeCrimeMarkers() {
    // need to sort out the markers and the array
    for (var i = 0; i < markers.length; i++) {
        if (viewmodel.selectedCategory() === '') {
            console.log('I am undefined and caught');
        } else if (markers[i].title !== viewmodel.selectedCategory()) {
            markers[i].setMap(null);
        } else {
            // Extend the boundries of the map for each marker
            bounds.extend(markers[i].position);
            map.fitBounds(bounds);
            markers[i].setMap(map);
        }
    }
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
        if (self.locationName())
            // check to see if location already exists in array
            if (self.last5Searches().indexOf(self.locationName()) === -1)
                this.last5Searches.push(this.locationName());
        // maximum of 5 locaations allowed in array
        if (self.last5Searches().length > 5)
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
        poplateinfowindow(clickedCrime.marker, largeInfoWindow);
        self.listOfCrimes("List of crimes");
    };

    // Just extract the categories from data
    this.justCategories = ko.computed(function() {
        var categories = ko.utils.arrayMap(self.crimes(), function(item) {
            return item.category();
        });
        return categories.sort();
    });

    // Just extract the locations from data
    this.justLocations = ko.computed(function() {
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


    // filter crime list and markers based on dropdown
    this.filteredCrimes = ko.computed(function() {
        if (self.selectedCategory() === undefined) {
            showallmarkers();
            return self.crimes();
        } else {
            removecrimemarkers();
            return ko.utils.arrayFilter(self.crimes(), function(crime) {
                return crime.category() === self.selectedCategory();
            });
        }
    });


    // Searches for location and returns markers
    this.knockoutSearch = function() {
        removeallmarkers();
        self.lastFive();
        self.selectedCategory(null);
    };
};

var viewmodel = new ViewModel();

// Activates knockout.js
ko.applyBindings(viewmodel);

// catch erorrs
function mapError() {
    alert("Google Maps failed to load... Please try again");
}
