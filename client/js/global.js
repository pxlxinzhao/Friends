/**
 * Created by patrickpu on 9/4/2015.
 */



if (Meteor.isClient){
    //-- global helper
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
        var user = Meteor.users.find({_id: Meteor.userId()});
        return user;
    }
    return null;
}

function getUserId(){
    if (Meteor.userId()) {
        return Meteor.userId()
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