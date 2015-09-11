
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

        var user = getCurrentUser();

        Meteor.call('addLoginTimes');

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

}



ServiceConfiguration.configurations.remove({
    service: 'facebook'
});

ServiceConfiguration.configurations.insert({
    service: 'facebook',
    appId: '899773626737808',
    secret: 'e6b0bd5198c5544fa4527575b3bec9be'
});





