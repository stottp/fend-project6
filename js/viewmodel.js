//api call to UK police data to rerieve a json list of crimes
var getcrimes = function getCrimesData(lat, lng, date) {
    var crimeUrl = 'https://data.police.uk/api/crimes-street/all-crime?lat=' + lat + '&lng=' + lng + '&date=2017-01';
    var lat = lat;
    var lng = lng;
    var date = 2017-01;

    $.getJSON(crimeUrl, function (data) {
        console.log(data);
        appViewModel.crimeResults(data);
        console.log(appViewModel.crimeResults());
        console.log('The length of the array is ' + appViewModel.crimeResults().length);
        console.log('The first element is ' + JSON.stringify(appViewModel.crimeResults()[0]));

    });
};


var updatemarkers = function updateCrimeMarkers() {
    var locations = []
    var updateMap = new google.maps.Map(document.getElementById('map'));
    var bounds = new google.maps.LatLngBounds();
    for (var i = 0; i < appViewModel.crimeResults().length; i++) {
        var crimeCategory = appViewModel.crimeResults()[i].category;
        var crimePosition = appViewModel.crimeResults()[i].location;
        var crimeLat = Number(appViewModel.crimeResults()[i].location.latitude);
        var crimeLng = Number(appViewModel.crimeResults()[i].location.longitude);

        var crimePosition = {lat: crimeLat, lng: crimeLng};
        console.log(crimePosition);
        // Crime locations

        locations.push({category: crimeCategory, location: crimePosition})


        var myLatlng = new google.maps.LatLng(crimeLat, crimeLng);
        console.log(myLatlng);

        var marker = new google.maps.Marker({
            map: updateMap,
            position: myLatlng,
            id: i,
            title: crimeCategory,
            animation: google.maps.Animation.DROP
        });

        // Add the crime locations to the map
        markers.push(marker);

        // Extend the boundries of the map for each marker
        bounds.extend(marker.position);
    }

    console.log(locations);
    console.log(markers);

    // To add the marker to the map, call setMap();
    updateMap.fitBounds(bounds);
    //marker.setMap(updateMap);

};


var getcrimesforlocation = function getCrimesData(lat, lng, date) {
    var crimeUrlTest = 'https://data.police.uk/api/crimes-street/all-crime?lat=52.4199&lng=-2.14521&date=2017-01';
    var crimeUrl = 'https://data.police.uk/api/crimes-street/all-crime?lat=' + lat + '&lng=' + lng + '&date=2017-01';
    var lat = lat;
    var lng = lng;
    var date = 2017-01;
    console.log(crimeUrl);

    $.getJSON(crimeUrl, function (data) {
        console.log(data);
        crimes = data;

        for (var i = 0; i < crimes.length; i++) {
            var crime = crimes[i];
            console.log(crime);
            this.crimeList.push( new Crime(crime) );
        }

        return crimes
    })
}


var initialCrimes = [
    {category: "anti-social-behaviour", id: 54252665, location: {latitude: "52.419415", longitude: "-2.145039"}, street: {id: 1237061, name: "On or near Chapel Street"}, month: "2017-01"},
    {category: "anti-social-behaviour", id: 54467992, location: {latitude: "52.440033", longitude:"-2.134354"}, street: {id: 1249874, name: "On or near Chaddesley Drive"}, month: "2017-01"},
    {category: "burglary", id: 54234839, location: {latitude: "52.426212", longitude: "-2.128988"}, street: {id: 1225231, name: "On or near Newlands Close"}, month: "2017-01"},
    {category: "criminal-damage-arson", id: 54448378, location: {latitude: "52.439350", longitude: "-2.117199"}, street: {id: 1249908, name: "On or near Dobbins Oak Road"}, month: "2017-01"},
    {category: "shoplifting", id: 54241786, location: {latitude: "52.419877", longitude: "-2.142659"}, street: {id: 1237064, name: "On or near Worcester Close"}, month: "2017-01"}
];

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

    //maybe call this crime List?
    this.crimeResults = ko.observableArray();

    //get search location
    this.locationName = ko.observable();

    //current crimes
    this.crimeList = ko.observableArray([]);

    initialCrimes.forEach(function(crimeItem) {
        self.crimeList.push( new Crime(crimeItem) );

    });

    //create new instance of crimeData
    this.currentCrime = ko.observable( this.crimeList() );

    //keep track of the last 5 searches
    this.last5Searches = ko.observableArray();

    this.arrayInformation = function() {
        alert('The length of the array is ' + this.crimeList().length);
        alert('The first element is ' + this.crimeList()[0].category());
    };

    //call ajax query
    this.getCrimes = function() {
            this.last5Searches.push(this.locationName());
            console.log(this.last5Searches());
        }, this;


    this.viewCrime = function(clickedCrime) {
            alert(clickedCrime);
    };

    this.getCrimes2 = function() {
        getcrimes(lat, lng, 2017-01)
    };

    this.addMarkers = function() {
        updatemarkers();
    };

}

var appViewModel = new AppViewModel();

// Activates knockout.js
ko.applyBindings(appViewModel);
