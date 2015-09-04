Router.configure({
    layoutTemplate: 'main'
});

Router.route('/', {
    template: 'explore'
});

Router.route('/profile', {
    template: 'userProfile'
});

ServiceConfiguration.configurations.remove({
    service: 'facebook'
});

ServiceConfiguration.configurations.insert({
    service: 'facebook',
    appId: '899773626737808',
    secret: 'e6b0bd5198c5544fa4527575b3bec9be'
});

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

    //Accounts.onLogin(function(user){
    //    console.log(user.user._id);
    //});

    Template.login.events({
        'click #facebook-login': function(event) {
            Meteor.loginWithFacebook({}, function(err){
                if (err) {
                    throw new Meteor.Error("Facebook login failed");
                }
            });
        },

        'click #logout': function(event) {
            Meteor.logout(function(err){
                if (err) {
                    throw new Meteor.Error("Logout failed");
                }
            })
        }
    });

}

if (Meteor.isServer) {
  Meteor.startup(function () {
    
  });
}

