
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

    var pwd = AccountsTemplates.removeField('password');
    AccountsTemplates.removeField('email');
    AccountsTemplates.addFields([
        {
            _id: "username",
            type: "text",
            displayName: "username",
            required: true,
            minLength: 5,
        },
        {
            _id: 'email',
            type: 'email',
            required: true,
            displayName: "email",
            re: /.+@(.+){2,}\.(.+){2,}/,
            errStr: 'Invalid email',
        },
        {
            _id: 'username_and_email',
            type: 'text',
            required: true,
            displayName: "Login",
        },
        pwd
    ]);

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






