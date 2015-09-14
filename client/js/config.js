
if (Meteor.isClient) {

    Meteor.call('countUser', function(err, result){
        if (err){
            console.log(err);
        }else{
            USER_NUMBER = result;
        }
    });

    //Accounts.ui.config({
    //    requestPermissions: {
    //        facebook: ['user_likes'],
    //        github: ['user', 'repo']
    //    },
    //    requestOfflineToken: {
    //        google: true
    //    },
    //    passwordSignupFields: 'USERNAME_AND_OPTIONAL_EMAIL'
    //});
    //
    //Accounts.onLogin(function(){
    //
    //    Meteor.call('loginSetup');
    //
    //    navigator.geolocation.getCurrentPosition(function(position) {
    //        var c = {};
    //        c.timestamp = position.timestamp;
    //        for (var key in position.coords){
    //            c[key] = position.coords[key];
    //        }
    //
    //        Meteor.call('setLocation', c);
    //    });
    //
    //});

    Avatar.options = {
        fallbackType: "initials",
        defaultImageUrl: "images/user.png",
        gravatarDefault: "identicon",
        customImageProperty: ''
    };

    $.cloudinary.config({
        cloud_name:"dfmztowxz"
    });

}







