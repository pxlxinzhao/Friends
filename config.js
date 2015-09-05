/**
 * Created by Patrick_Pu on 2015-09-05.
 */

if (Meteor.isClient) {

    Accounts.ui.config({
        requestPermissions: {
            facebook: ['user_likes'],
            github: ['user', 'repo']
        },
        requestOfflineToken: {
            google: true
        },
        passwordSignupFields: 'USERNAME_AND_OPTIONAL_EMAIL'
    });

    Accounts.onLogin(function(){
        var user = getUser();
        var profile = getProfile();

        //set online
        profile.isOnline = true;

        //set loginTimes
        var times = profile.loginTimes;
        if (!times) {
            times = 0;
        }
        times ++;
        profile.loginTimes = times;

        //saving profile
        setProfile(user, profile);

        //geo location
        setGeoPosition();

    });



}

if (Meteor.isClient) {

    var helpers = {
        getUsername: getUsername,
        getUserId: getUserId,
        getUser: getUser
    }

    for (var key in helpers){
        Template.registerHelper(key, helpers[key]);
    }

}

// defining global functions

function getUser(){
    if (Meteor.userId()){
        var user = Meteor.users.findOne({_id: Meteor.userId()});
        return user;
    }
    return null;
}

function getUserId(){
    if (Meteor.userId()) {
        return Meteor.userId();
    } else {
        return null;
    }
}

function getUsername(){
    if (Meteor.userId()){
        var user = Meteor.users.findOne(Meteor.userId());
        return user ? user.profile.name : null;
    }
    return null;
}

function getProfile(){
    var profile = getUser().profile;
    if (!profile) {
        profile = {};
    }
    return profile;
}

function setProfile(user, profile){
    console.log('setting profile: ', profile);

    Meteor.users.update({_id: user._id}, {$set: {profile: profile}});
}

function setGeoPosition(){
    navigator.geolocation.getCurrentPosition(function(position) {

        var latlng = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
        }

        var geocoder = new google.maps.Geocoder();
        var latlngGoogle = new google.maps.LatLng(pos.coords.latitude,pos.coords.longitude);

        geocoder.geocode({'latLng': latlngGoogle}, function(results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                console.log('result: ', result);
            }
        });

        var user = getUser();
        var profile = getProfile();

        profile.latlng = latlng;

        setProfile(user, profile);
    });
}