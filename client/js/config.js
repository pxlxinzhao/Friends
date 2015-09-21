
if (Meteor.isClient) {

    Meteor.call('countUser', function(err, result){
        if (err){
            console.log(err);
        }else{
            USER_NUMBER = result;
        }
    });

    AccountsTemplates.configure({
        onSubmitHook: function(err, state){
            if(!err) {
                var $modal = $('#modal1');
                $modal.closeModal();
                $modal.find('.at-error').hide();
                //console.log('state', state);
                if (state === 'signIn'){
                    var $nav = $('.nav');
                    $nav.velocity({
                        backgroundColorAlpha: 1
                    }, 0);
                    //Router.go('explore');
                    //var url = window.location.host;
                    //console.log('redirecting: ','http://'+url);
                    //window.location.replace('http://localhost:3000');
                }
            }
        }
    });

    Avatar.options = {
        fallbackType: "initials",
        defaultImageUrl: "images/user.png",
        gravatarDefault: "identicon",
        customImageProperty: ''
    };

    $.cloudinary.config({
        cloud_name:"dfmztowxz"
    });

    //Transitioner.transition({
    //    fromRoute: 'home',
    //    toRoute: 'explore',
    //    velocityAnimation: {
    //        in: 'transition.fadeIn',
    //        out: 'transition.fadeOut'
    //    }
    //})

}


//Accounts.ui.config({
//    requestPermissions: {
//        facebook: ['user_likes'],
//        github: ['user', 'repo']
//    },
//    requestOfflineToken: {
//        google: true
//    },
//    passwordSignupFields: 'USERNAME_AND_OPTIONAL_EMAIL'
//});
//
//Accounts.onLogin(function(){
//
//    Meteor.call('loginSetup');
//
//    navigator.geolocation.getCurrentPosition(function(position) {
//        var c = {};
//        c.timestamp = position.timestamp;
//        for (var key in position.coords){
//            c[key] = position.coords[key];
//        }
//
//        Meteor.call('setLocation', c);
//    });
//
//});





