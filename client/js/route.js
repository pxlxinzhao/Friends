/**
 * Created by patrickpu on 9/11/2015.
 */

Router.configure({
    layoutTemplate: 'main'
});

Router.route('/', {
    template: 'explore'
});

Router.route('/explore', {
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
        var notificationId = Notifications.warn('Please login first');
        removeNotification(notificationId);
        var $nav = $('.nav');
        $nav.velocity({
            backgroundColorAlpha: 0
        }, 0);
        this.render('welcome');
    } else {
        this.next();
    }
});