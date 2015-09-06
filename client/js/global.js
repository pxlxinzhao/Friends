/**
 * Created by Patrick_Pu on 2015-09-05.
 */

// defining global functions

getUser = function(){
    if (Meteor.userId()){
        var user = Meteor.users.findOne({_id: Meteor.userId()});
        return user;
    }
    return null;
}

getUserId = function(){
    if (Meteor.userId()) {
        return Meteor.userId();
    } else {
        return null;
    }
}

getUsername = function(user){
    user = user.hash.user;

    if (user.profile && user.profile.name){
        return user.profile.name;
    }else{
        return user.username;
    }
}

getProfile = function(){
    var profile = getUser().profile;
    if (!profile) {
        profile = {};
    }
    return profile;
}

setProfile = function(user, profile){
    //console.log('setting profile: ', profile);

    Meteor.users.update({_id: user._id}, {$set: {profile: profile}});
}

setGeoPosition = function(){
    navigator.geolocation.getCurrentPosition(function(position) {

        var latlng = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
        }

        //save complete location object
        Meteor.call('reverseGeoCode', latlng);
    });
}

getCity = function(user){
    user = user.hash.user;

    var city;
    try{
        city =  user.profile.location.city;
    }catch(err){
        city = '';
    }
    return city;
}

getStatus = function(user){
    user = user.hash.user;

    var status;
    try{
        status =  user.profile.isOnline;
    }catch(err){
        status = false;
    }
    return status ? 'online' : 'offline';
}