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


  Template.explore.helpers({
      getUsers: function () {
          var users = Meteor.users.find().fetch();
          return users;
      }
  });

  //-- global helper
  Template.registerHelper('getUsername', function (){
      if (Meteor.userId()){
          var user = Meteor.users.findOne(Meteor.userId());
          return user ? user.profile.name : null;
      }
      return null;
  });

  Template.registerHelper('getUserId', function(){
      if (Meteor.userId()){
          var user = Meteor.users.findOne(Meteor.userId());
          return user._id;
      }
      return null;
  })

  Template.registerHelper('getUser', function(){
      if (Meteor.userId()){
          var user = Meteor.users.find({_id: Meteor.userId()});
          return user;
      }
      return null;
  })

}

if (Meteor.isServer) {
  Meteor.startup(function () {
    
  });
}

