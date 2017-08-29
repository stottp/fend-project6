// api call to UK police data to rerieve a json list of crimes
var getcrimes = function getCrimesData(lat, lng, date) {
    var crimeUrl = 'https://data.police.uk/api/crimes-street/all-crime?lat=' + lat + '&lng=' + lng + '&date' + date;
    var lat = lat;
    var lng = lng;
    var date = 2017-06;

    $.getJSON(crimeUrl, function (data) {
        //add the results to an observableArray and call updatemarkers and lastFive through a promise
        appViewModel.crimeResults(data);
    })
    // Check if there was an error or success .done could also be used
    .fail(function(e) {
        alert('Sorry there was an error selecting the data, please try again');
    })
    .always(function() {
        if(appViewModel.crimeResults().length > 0) {
            updatemarkers();
            appViewModel.lastFive();
        } else {
            alert('Sorry that location did not return a list of crimes');
        }

    });

    //appViewModel.crimeResults(data);
    //}).then(updatemarkers).then(appViewModel.lastFive());

    // add to the observable array
    appViewModel.crimeResults().forEach(function(crimeItem) {
        appViewModel.crimeList.push(new Crime2(crimeItem));
    });
};

// Test function to bind the markers together - http://jsfiddle.net/t9wcC/
function point(name, lat, long) {
    this.name = name;
    this.lat = ko.observable(lat);
    this.long = ko.observable(long);

    var marker = new google.maps.Marker({
        position: new google.maps.LatLng(lat, long),
        title: name,
        map: map,
        draggable: true
    });

// creates all the new markers for the crimes from the api call and drop them on the map
var updatemarkers = function updateCrimeMarkers() {

    //var updateMap = init.map;
    var updateMap2 = appViewModel.map;
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

    for (var i = 0; i < appViewModel.crimeList().length; i++) {
        console.log(appViewModel.crimeList()[i].location);
    }

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

        //
        //appViewModel.crimeMarkers.push(marker);

        //create an onclick event to open an info window on marker
        marker.addListener('click', function() {
            poplateinfowindow(this, largeInfoWindow);
            makemarkerbounce(this);
        });

        // Extend the boundries of the map for each marker
        bounds.extend(marker.position);
    }

    // Add the markers to the map through setMap;
    updateMap.fitBounds(bounds);
    marker.setMap(updateMap);

};

// Class to represent the crime data model
var Crime2 = function(data) {
    //declare with this or var?
    this.category = ko.observable(data.category);
    this.id = ko.observable(data.id);
    this.location = ko.observable(data.location);
    this.street = ko.observable(data.street);
    this.month = ko.observable(data.month);
};


var Crime = function() {
    this.category = ko.observable('A crime');
    this.location = ko.observable('A location');
};

var AppViewModel = function() {
    var self = this;

    //get lat lng in ko observable
    this.lat = ko.observable();
    this.lng = ko.observable();

    // Never push to the array to get a new list when a new location is searched
    this.crimeResults = ko.observableArray();

    // Store crimes in an observableArray
    this.crimeList = ko.observableArray([]);

    // current crime that has been clicked
    this.currentCrime = ko.observable( this.crimeList()[0] );


    // Sets the current crime
    this.setCrime = function(clickedCrime2) {
        self.currentCrime(clickedCrime2);
    };

    // Stores markers in array
    this.crimeMarkers = ko.observableArray();


    this.map = function() {
        new google.maps.Map(document.getElementById('map'), {
        zoom: 15,
        //center: {lat: 52.678419, lng: -2.445257999999967},
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
};



    // Create an array of the types of crimes, possibly with the number of occurances?
    this.crimeResultsCategories = ko.observableArray([{category: "None"}, {category: "anti-social-behaviour"}, {category: "burglary"}]);


    this.selectedCategory = ko.observable();

    //get search location
    this.locationName = ko.observable();

    //keep track of the last 5 searches
    this.last5Searches = ko.observableArray();

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

    // Searches for location and returns markers
    this.knockoutSearch = function() {
        geocode();
    };
};


// turn on deferred updates
ko.options.deferUpdates = true;

var appViewModel = new AppViewModel();

// Activates knockout.js
ko.applyBindings(appViewModel);
