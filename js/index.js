Router.configure({
    layoutTemplate: 'main'
});

Router.route('/', {
    template: 'explore'
});

Router.route('/profile', {
    template: 'userProfile'
});


if (Meteor.isClient) {

  Accounts.ui.config({
    passwordSignupFields: "USERNAME_ONLY"
  });

}

if (Meteor.isServer) {
  Meteor.startup(function () {
    
  });
}

