/**
 * Created by Patrick_Pu on 2015-09-05.
 */

DIALOG_MESSAGE = 'Default Message';

// defining global functions

getDialogMessage = function(){
    return DIALOG_MESSAGE;
}


//--user stuff

getCurrentUser = function(){
    return Meteor.user();
}

getCurrentUserId = function(){
    return Meteor.userId();
}

getCurrentProfile = function(){
    var user = Meteor.user();
    var profile = {};
    if(user && user.profile){
        profile = user.profile;
    }
    return profile;
}

getUserById = function(id){
    return Meteor.users.findOne({_id: id});
}

getUsername = function(user){

    user = user.hash.user;
    if (user) {
        if (user.profile && user.profile.name){
            return user.profile.name;
        }else{
            return user.username;
        }
    }

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

    //console.log('user', user);
    //
    //if (user && user.username === 'Patrick Pu'){
    //    console.log(user);
    //}
    //var status;
    //try{ status =  user.profile.isOnline;
    //}catch(err){ status = false; }
    try{
        if (user.status.idle){
            return "idle";
        }
        else if (user.status.online){
            return "online"
        }
        else{
            return "offline";
        }
    }catch (err){
        return "off"
    }
}

getLoginTime = function(user){
    user = user.hash.user;

    if (user.status && user.status.online){
        console.log(user.status.lastLogin);
    }
}

