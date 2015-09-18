/**
 * Created by patrickpu on 9/11/2015.
 */

Router.map(function () {
    this.route('postShow', {
        path: '/posts/:_id',

        onBeforeAction: function (pause) {
            if (!Meteor.user()) {
                // render the login template but keep the url in the browser the same
                this.render('login');
            }
        }
    }

Router.configure({
    layoutTemplate: 'main'
});

Router.route('home', {
    path: '/',
    template: 'welcome'
});

Router.route('explore', {
});

Router.route('profile', {
    template: 'userProfile'
});

Router.route('tag', {
    template: 'userTags'
});

Router.route('photos', {
});

Router.route('messages', {
});

Router.route('user', {
    path: '/user/:id',
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
        //var notificationId = Notifications.warn('Please login first');
        //removeNotification(notificationId);
        this.render('welcome');
    } else {
        $('.nav').velocity({
            backgroundColorAlpha: 1
        }, 0);
        $('footer').velocity({
            opacity: 1
        }, 0);
        this.next();
    }
});