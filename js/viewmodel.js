// api call to UK police data to rerieve a json list of crimes
var getcrimes = function getCrimesData(lat, lng, date) {
    var crimeUrl = 'https://data.police.uk/api/crimes-street/all-crime?lat=' + lat + '&lng=' + lng + '&date' + date;
    var lat = lat;
    var lng = lng;
    var date = 2017-06;

    $.getJSON(crimeUrl, function (data) {
        //add the results to an observableArray
        appViewModel.crimeResults(data);
        console.log(appViewModel.crimeResults());
    });
};

// create all the new markers for the crimes from the api call
var updatemarkers = function updateCrimeMarkers() {

    //var updateMap = init.map;
    var updateMap = new google.maps.Map(document.getElementById('map'), {
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

    for (var i = 0; i < appViewModel.crimeResults().length; i++) {
        var crimeCategory = appViewModel.crimeResults()[i].category;
        var crimePosition = appViewModel.crimeResults()[i].location;
        var crimeLat = Number(appViewModel.crimeResults()[i].location.latitude);
        var crimeLng = Number(appViewModel.crimeResults()[i].location.longitude);

        // Crime locations
        var crimePosition = {lat: crimeLat, lng: crimeLng};
        var myLatlng = new google.maps.LatLng(crimeLat, crimeLng);

        var marker = new google.maps.Marker({
            map: updateMap,
            position: myLatlng,
            id: i,
            title: crimeCategory,
            animation: google.maps.Animation.DROP
        });

        // Add the crime locations to the map
        markers.push(marker);

        //create an onclick event to open an info window on marker
        marker.addListener('click', function() {
            poplateinfowindow(this, largeInfoWindow);
            makemarkerbounce(this)
        })

        // Extend the boundries of the map for each marker
        bounds.extend(marker.position);
    }

    // Add the markers to the map through setMap;
    updateMap.fitBounds(bounds);
    marker.setMap(updateMap);

};

// Class to represent the crime data model
var Crime = function(data) {
    //declare with this or var?
    this.category = ko.observable(data.category);
    this.id = ko.observable(data.id);
    this.location = ko.observable(data.location);
    this.street = ko.observable(data.street);
    this.month = ko.observable(data.month);
}

var AppViewModel = function() {
    var self = this;

    //get lat lng in ko observable
    this.lat = ko.observable();
    this.lng = ko.observable();

    // Never push to the array to get a new list when a new location is searched
    this.crimeResults = ko.observableArray();

    // Create an array of the types of crimes, possibly with the number of occurances?
    this.crimeResultsCategories = ko.observableArray([{category: "None"}, {category: "anti-social-behaviour"}, {category: "burglary"}]);

    // Create an array of the types of crimes, possibly with the number of occurances?
    //this.selectedCategory = ko.observableArray(this.crimeResultsCategories()[0]);
    //this.selectedCategory = ko.observableArray(this.crimeResultsCategories())

    this.uniqueCategories = ko.pureComputed(function() {
        var unique = [];
        for (var i = 0; i < this.crimeResults.length; i++) {
            if (unique.indexOf(this.crimeResults[i]) == -1)
            unique.push(this.crimeResults[i].category)
        }
        return unique;
        console.log(unique)
    }, this);

    this.selectedCategory = ko.observable();

    //get search location
    this.locationName = ko.observable();

    //keep track of the last 5 searches
    this.last5Searches = ko.observableArray();

    //add last 5 locations
    this.lastFive = function() {
            this.last5Searches.push(this.locationName());
            console.log(this.last5Searches());
        };

    //this would call all of the functions one after another to produce the list
    this.knockoutSearch = function() {
        geocode();
        getcrimes(lat, lng, 2017-03);
        this.lastFive();
    }

    this.getCrimes = function() {
        getcrimes(lat, lng, 2017-03);
    };

    this.addMarkers = function() {
        updatemarkers();
    };

}

var appViewModel = new AppViewModel();

// Activates knockout.js
ko.applyBindings(appViewModel);
