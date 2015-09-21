/**
 * Created by patrickpu on 9/11/2015.
 */

Router.configure({
    layoutTemplate: 'main'
});

Router.map(function () {
     this.route('home', {
        path: '/',
        template: 'welcome',
        onBeforeAction: function () {
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
                this.render('explore');
            }
        }
    });

    this.route('user', {
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

    this.route('profile', {
        template: 'userProfile'
    });

    this.route('tag', {
        template: 'userTags'
    });

    this.route('photos', {
    });

    this.route('messages', {
    });

    this.route('explore', {
    });
});


//
//
//
//Router.onBeforeAction(function() {
//    if (! Meteor.userId()) {
//        //var notificationId = Notifications.warn('Please login first');
//        //removeNotification(notificationId);
//        this.render('welcome');
//    } else {
//        $('.nav').velocity({
//            backgroundColorAlpha: 1
//        }, 0);
//        $('footer').velocity({
//            opacity: 1
//        }, 0);
//        this.next();
//    }
//});