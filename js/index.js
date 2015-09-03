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
    requestPermissions: {
      facebook: ['user_likes'],
      github: ['user', 'repo']
    },
    requestOfflineToken: {
      google: true
    },
    passwordSignupFields: 'USERNAME_AND_OPTIONAL_EMAIL'
  });


  Template.userProfile.helpers({
    getUsername: function (){
      if (Meteor.userId()){
         var user = Meteor.users.findOne(Meteor.userId());
         return user.username;
      }
      return null;
    }
  });

}

if (Meteor.isServer) {
  Meteor.startup(function () {
    
  });
}

