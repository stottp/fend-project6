// Class to represent the crime data
function Crime(category, id, location) {
    this.category = category;
    this.id = id;
    this.location = location;
}

var AppViewModel = function() {

    //crime data from ajax call - var or this?
     this.crimeData = ko.observableArray([
        {category: "anti-social-behaviour", id: 54252665, location: {latitude: "52.419415", longitude: "-2.145039"}, street: {id: 1237061, name: "On or near Chapel Street"}, month: "2017-01"},
        {category: "anti-social-behaviour", id: 54467992, location: {latitude: "52.440033", longitude:"-2.134354"}, street: {id: 1249874, name: "On or near Chaddesley Drive"}, month: "2017-01"},
        {category: "burglary", id: 54234839, location: {latitude: "52.426212", longitude: "-2.128988"}, street: {id: 1225231, name: "On or near Newlands Close"}, month: "2017-01"},
        {category: "criminal-damage-arson", id: 54448378, location: {latitude: "52.439350", longitude: "-2.117199"}, street: {id: 1249908, name: "On or near Dobbins Oak Road"}, month: "2017-01"},
        {category: "shoplifting", id: 54241786, location: {latitude: "52.419877", longitude: "-2.142659"}, street: {id: 1237064, name: "On or near Worcester Close"}, month: "2017-01"}
    ]);

    this.firstName = ko.observable("Bert");
    this.lastName = ko.observable("Bertington");

    this.fullName = ko.computed(function() {
    return this.firstName() + " " + this.lastName();
    }, this);

    this.capitalizeLastName = function() {
        var currentVal = this.lastName();        // Read the current value
        this.lastName(currentVal.toUpperCase()); // Write back a modified value
    };

    this.arrayInformation = function() {
        alert('The length of the array is ' + crimeData().length);
        alert('The first element is ' + crimeData()[0]);
    }

}

// Activates knockout.js
ko.applyBindings(new AppViewModel());
