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

    var helpers = {
        getUsername: getUsername,
        getUserId: getUserId,
        getUser: getUser,
        getCity: getCity,
        getStatus: getStatus
    }

    for (var key in helpers){
        Template.registerHelper(key, helpers[key]);
    }

}
