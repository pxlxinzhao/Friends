Router.configure({
    layoutTemplate: 'main'
});

Router.route('/', {
    template: 'explore'
});

Router.route('/profile', {
    template: 'userProfile'
});

Router.route('/tag', {
    template: 'userTags'
});

Router.route('/photos', {
    template: 'photos'
});

Router.route('/messages', {
    template: 'messages'
});

Router.route('/user/:id', {
    template: 'otherUserProfile',
    data: function (){
        var id  = this.params.id;
        var user = getUserById(id);
        var templateData = {
            user: user
        };
        return templateData;
    }
});

Router.onBeforeAction(function() {
    if (! Meteor.userId()) {
        var notificationId = Notifications.warn('Notice', 'Please login first');
        removeNotification(notificationId);
        this.render('explore');
    } else {
        this.next();
    }
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




