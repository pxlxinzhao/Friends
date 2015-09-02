Router.configure({
    layoutTemplate: 'main'
});

Router.route('/', {
    template: 'explore'
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

