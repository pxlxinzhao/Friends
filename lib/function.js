/**
 * Created by Patrick_Pu on 2015-09-05.
 */


//-- Dialog

getDialogMessage = function(){
    return DIALOG_MESSAGE;
}

//-- Notification

removeNotification = function(notificationId){
    Meteor.setTimeout( function () {
        Notifications.remove({ _id: notificationId });
    },  3000 );
}

//-- User

    //--for current
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

    //--needs arguments (getter)
getUserById = function(id){
    return Meteor.users.findOne({_id: id});
}

getUsername = function(obj){
    if (!obj.hash.user && !obj.hash.userId) return;

    var user = obj.hash.user ? obj.hash.user : getUserById(obj.hash.userId);

    if (user) {
        if (user.profile && user.profile.name){
            return user.profile.name;
        }else{
            return user.username;
        }
    }

}

getCity = function(obj){
    if (!obj.hash.user && !obj.hash.userId) return;

    var user = obj.hash.user ? obj.hash.user : getUserById(obj.hash.userId);
    var location = LOCATIONS.findOne({_id: user._id});

    //console.log('location', location);

    if (location && location.address){
        return location.address[0].city;
    }
}

getStatus = function(obj){
    if (!obj.hash.user && !obj.hash.userId) return;

    var user = obj.hash.user ? obj.hash.user : getUserById(obj.hash.userId);

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

getLoginTime = function(obj){
    if (!obj.hash.user && !obj.hash.userId) return;

    var user = obj.hash.user ? obj.hash.user : getUserById(obj.hash.userId);

    if (user && user.status && user.status.lastLogin){
       return moment(user.status.lastLogin.date).fromNow();
    }
}

    //--setter
setProfile = function(user, profile){
    //console.log('setting profile: ', profile);
    Meteor.users.update({_id: user._id}, {$set: {profile: profile}});
}



