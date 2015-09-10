/**
 * Created by Patrick_Pu on 2015-09-05.
 */


if (Meteor.isClient) {
    Tracker.autorun(function(){
        Meteor.subscribe('allUserData');
        Meteor.subscribe('allMessages');
        Meteor.subscribe('allTags');
        Meteor.subscribe('allPhotos');
    })

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


        var user = getCurrentUser();
        var profile = user.profile ? user.profile : {};

        //set online
        //profile.isOnline = true;

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

    Avatar.options = {
        fallbackType: "initials",
        defaultImageUrl: "images/user.png",
        gravatarDefault: "identicon"
    };

    $.cloudinary.config({
        cloud_name:"cloud_name"
    });

    var helpers = {
        getUsername: getUsername,
        getCurrentUserId: getCurrentUserId,
        getCurrentUser: getCurrentUser,
        getCity: getCity,
        getStatus: getStatus,
        getUserById: getUserById,
        getDialogMessage: getDialogMessage,
        getLoginTime: getLoginTime
    }

    for (var key in helpers){
        Template.registerHelper(key, helpers[key]);
    }

}





