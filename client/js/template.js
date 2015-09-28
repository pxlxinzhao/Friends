/**
 * Created by patrickpu on 9/4/2015.
 */

var tagEditable = false;
var files = null;

if (Meteor.isClient){


//-- Register global helpers
    var helpers = {
        formatTime: formatTime,
        getUsername: getUsername,
        getCurrentUserId: getCurrentUserId,
        getEmail: getEmail,
        getCity: getCity,
        getStatus: getStatus,
        getUserById: getUserById,
        getUsernameById: getUsernameById,
        getDialogMessage: getDialogMessage,
        getLoginTime: getLoginTime,
        getFacebookPhotoUrl: getFacebookPhotoUrl
    }

    for (var key in helpers){
        Template.registerHelper(key, helpers[key]);
    }


//NAVIGATION
    Template.navigation.onRendered(function(){
        $(".button-collapse").sideNav({
            menuWidth: 240, // Default is 240
            edge: 'right', // Choose the horizontal origin
            closeOnClick: true // Closes side-nav on <a> clicks, useful for Angular/Meteor
        });

        $('.collapsible').collapsible({
            accordion : true // A setting that changes the collapsible behavior to expandable instead of the default accordion style
        });

        $('.dropdown-button').dropdown({
                inDuration: 300,
                outDuration: 225,
                constrain_width: true,
                hover: false,
                gutter: 0,
                belowOrigin: false
            }
        );
    });

    Template.navigation.events({
        'click .logout-btn': function(e){
            //e.preventDefault();
            AccountsTemplates.logout();
            Router.go('home');
        },
        'click .modal-trigger': function () {
            $('#modal1').openModal();
        },
        'submit #search-form': function (event) {
            event.preventDefault();
            var value = $("#search").val();
            //Session.set('userOffset', 10);
            Session.set('keyword', value);
        }
    });


//Welcome
    Template.welcome.onRendered(function () {

        //    initializeDots();

        $('.nav').velocity({
            backgroundColorAlpha: 0
        }, 0);
        $('footer').velocity({
            opacity: 0
        }, 0);

        $(".fullpage-title").children()
            .velocity("transition.slideLeftIn", { stagger: 1800 }, 1000)
            .delay(750);

        $('.fullpage-right .btn').click(function () {
            $('#modal1').openModal();
        });
    });

//EXPLORE RELATED
    Template.explore.created = function(){

        //Session.set('userOffset', 10);
        if (!Session.get('keyword')){
            Session.set('keyword', '');
        }

        //Deps.autorun(function(){
        //    Meteor.subscribe('userData', Session.get('userOffset'), Session.get('keyword'));
        //});
    }

    Template.explore.helpers({
        getUsersByLastLogin: function () {
            var users = Meteor.users.find({_id: {$ne: Meteor.userId()}, username: new RegExp(Session.get('keyword'), 'i')}, {profile: 1, limit: 1000}).fetch();
            users.sort(sortByLastLogin);

            //console.log('explore users', users);
            return users;
        },
        getUsersByLoginTimes: function () {
            var users = Meteor.users.find({_id: {$ne: Meteor.userId()}}, {profile: 1, limit: 3}).fetch();
            users.sort(SortByLoginTimes);

            //console.log('explore users', users);
            return users;
        },
        getUsersByStatus: function(){
            //SortByStatus
            var users = Meteor.users.find({_id: {$ne: Meteor.userId()}}, {status: 1, limit: 3}).fetch();
            users.sort(SortByStatus);

            //console.log('explore users', users);
            return users;
        }
    });

    Template.explore.rendered = function() {

        var max = Meteor.users.find({}).count();
        //console.log('max', max);
        // is triggered every time we scroll
        $(window).scroll(function() {
            if ($(window).scrollTop() + $(window).height() > $(document).height() - 10) {

                var uo = Session.get('userOffset');
                if (uo < USER_NUMBER){
                    uo += 5;
                    Session.set('userOffset', uo);
                }else{
                    $(window).off('scroll');
                }

            }
        });
    }


//-- PROFILE RELATED
    Template.userProfile.helpers({
        getSelfIntro: function () {
            if (!Meteor.userId()) return;

            var user = Meteor.user();
            if (user && user.profile && user.profile.selfIntro){
                return Meteor.user().profile.selfIntro.trim();
            }
            else{
                return '';
            }
        }

    });

    Template.userProfile.events({
        'submit .profile-form': function(event){
            if (!Meteor.userId()) return;

            event.preventDefault();

            var name = $('#username').val();
            var email = $('#email').val();
            var selfIntro = $('#selfIntro').val();

            var profile = getCurrentUser().profile;
            if (!profile){
                profile = {};
            }

            profile.name = name;
            profile.email = email;
            profile.selfIntro = selfIntro;

            //console.log(selfIntro);

            setProfile(Meteor.user(), profile);

            Materialize.toast('Saved', 1500);
            //var i = Notifications.success('Successfully saved!')
            //removeNotification(i);
        }
    });
    
    Template.photos.onRendered(function () {

        $('.materialboxed').materialbox();

        new Darkroom('#photo-logo', {
            // Size options for the canvas
            minWidth: 100,
            minHeight: 100,
            maxWidth: 1000,
            maxHeight: 1000,
            //ratio: 4/3, // fix the canvas ratio, comment this line to use the image's ratio
            backgroundColor: '#000',

            // Plugins options
            //plugins: {
            //    history: true, // enable undo/redo?
            //    save: true, // enable save?
            //    crop: { // options for crop
            //        quickCropKey: 67, //key "c"
            //        minHeight: 50,
            //        minWidth: 50,
            //        ratio: 1 // fix ratio for cropping
            //    }
            //},

            // This is called after initialization
            initialize: function() {
                var cropPlugin = this.plugins['crop'];

                // Active crop selection
                cropPlugin.requireFocus();

                // set default selection
                //cropPlugin.selectZone(x1, y1, x2, y2);

                // Add custom listener
                this.addEventListener('core:transformation', function() { /* ... */ });
            }
        });
    });

    Template.photos.helpers({
        //initializeSlider: function () {
        //    $('.slider').slider();
        //    //{full_width: true}
        //}
        //initializeMaterialbox: function () {
        //    console.log('oops');
        //    $('.materialboxed').materialbox();
        //}
    })

    Template.photoUpdate.events({

        'change input[type="file"]': function(e){
            files = e.currentTarget.files;
            var names = [];
            for (var i=0; i<files.length; i++){
                console.log(files[i]);
                names.push(files[i].name);
            }
            console.log(names.join(', '));
        },
        'click #photo-update-btn': function(){
            //console.log('clicked', files);

            if (files){
                Cloudinary.upload(files, null, function(err, res){
                    console.log('success', res);
                    console.log('error', err);
                    if (res){
                        Meteor.call('updatePhotoForCurrentUser', res);
                    }
                });
            }
        }
    })

    Template.otherUserProfile.helpers({
        checkLike: function (id) {
            var relationship = RELATIONSHIPS.findOne({_id: Meteor.userId()});
            if (relationship){
                var like = relationship.like;
                if(like){
                    return $.inArray(id, like) > -1;
                }
            }
            return false;
        }
    });

    Template.otherUserProfile.events({
        "click #send-message": function(){
            var $input = $("#message-input");
            var receiverId = $input.attr('data-userId');
            var message = $input.val();

            if (receiverId && message.length > 0){
                Meteor.call('insertMessageForCurrentUser', receiverId, message);
                $input.val('');
            }
        },
        "click #user-like": function (event) {
            event.preventDefault();
            var userId = event.target.getAttribute('data-id');
            if (userId){

                console.log(1);
                console.log(lookForAttribute(event.target, 'data-like'));
                console.log(2);
                if(lookForAttribute(event.target, 'data-like') == 'true'){
                    Meteor.call('cancelLike', userId);
                }else{
                    Meteor.call('likeUser', userId);
                }
            }


            //console.log(userId, event.target, $(event.target).attr('data-id'));

        }
    });

    Template.userImage.helpers({
        getPhotoUrlById: function(id){
            var user =  getUserById(id);
            if (user){
                return user.photoUrl;
            }
        }
    });


//--TAGS RELATED
    Template.userTags.events({
        'click #tag-add': function (event) {
            event.preventDefault();

            var newTag = $('#new-tag input').val();

            if (newTag.length > 0){
                var user = Meteor.user();
                var profile = getCurrentProfile();
                var tags = [];
                var existingTagObject = TAGS.findOne({userId: Meteor.userId()});

                if (existingTagObject){
                    tags = existingTagObject.tags;

                    if ($.inArray(newTag, tags) > -1){
                        //Blaze.renderWithData('hint', 'This tag already exists');
                        //DIALOG_MESSAGE = 'This tag already exists';
                        //Modal.show('hint');
                        return;
                    }

                    tags.push(newTag);
                    //console.log('tags', tags);
                    Meteor.call('updateTagsForCurrentUser', tags);
                }else{
                    tags.push(newTag);
                    Meteor.call('insertTagsForCurrentUser', tags);
                }
            }
        },
        'click #tag-edit': function (event) {
            event.preventDefault();

            var target = $("#tag-edit");
            if (!tagEditable){
                tagEditable = true;
                target.text('Cancel Edit');
            }else{
                tagEditable = false;
                target.text('Edit');
            }
            var $tagsHolder = $("#tags-holder");
            $tagsHolder.empty();
            Blaze.render(Template.tags, $tagsHolder[0]);

            var $deleteHolder = $("#delete-btn-wrapper");
            $deleteHolder.empty();
            Blaze.render(Template.deleteBtn, $deleteHolder[0]);
        }
    });

    Template.tags.helpers({
        getTags: function(){
            if(Meteor.user()){
                var tagObject = TAGS.findOne({userId: Meteor.userId()});
                var result = tagObject ? tagObject.tags : [];
                return result;
            }
        }
    });

    Template.tag.helpers({
        isEditMode: isEditMode
    });

    Template.deleteBtn.helpers({
        isEditMode: isEditMode
    });

    Template.deleteBtn.events({
        'click #tag-delete': function(){
            var tags = TAGS.findOne({userId: Meteor.userId()}).tags;

            var length = $("#tags-holder").find('input:checked').each(function(){
                var text = $(this).attr('data-tag');


                for (var i=0; i<tags.length; i++){
                    if (text === tags[i]){
                        tags.splice(i, 1);
                        i--;
                    }
                }
            });

            Meteor.call('updateTagsForCurrentUser', tags);
        }
    });


//-- PHOTO RELATED
    var removeMarkerClicked = false;

    Template.photos.helpers({
        getCurrentUserPhotos: function(){
            return PHOTOS.find({userId: Meteor.userId()}).fetch();;
        }
    })

    Template.photos.events({
        'click .gallery-item': function(e){
            e.preventDefault();

            if (removeMarkerClicked){
                //console.log($(this));
                removeMarkerClicked = false;
            }
        },
        'click .photo-remove-marker': function(){
            removeMarkerClicked = true;
        },

        'dblclick .gallery-item': function(e){
            e.preventDefault();

            //console.log($(this));
            //var photo = $(this)[0];
            //if (photo){
            //    Meteor.call('updatePhotoUrl', photo, function(err){
            //        if (err){
            //            console.error(err);
            //        }else{
            //            var nId = Notifications.success('updated profile picture');
            //            removeNotification(nId);
            //        }
            //    });
            //}
        }

    });


//-- MESSAGES
    Template.messages.onRendered(function () {
        var $messageContainer =  $("#message-container");
        //console.log($messageContainer.height());
        $messageContainer.scrollTop($messageContainer.height());
    });

    Template.messages.helpers({
        getMessage: function(){
            //console.log('Session messaggSender: ',Session.get('MessageSender'));
            return MESSAGES.find({
                $or:[
                    {
                        receiverId: Meteor.userId(),
                        senderId: Session.get('MessageSender')
                    },
                    {
                        senderId: Meteor.userId(),
                        receiverId: Session.get('MessageSender')
                    }

                ]}
                ,
                {sort: {createdTime: -1}}
            ).fetch();
        },
        getMessageSendersForCurrentUser: function(){
            var result1 = MESSAGES.find(
                    {receiverId: Meteor.userId()},
                    {sort: {createdTime: -1}, fields: {"senderId": 1}}
                ).fetch();

            var result2 = MESSAGES.find(
                {senderId: Meteor.userId()},
                {sort: {createdTime: -1}, fields: {"receiverId": 1}}
            ).fetch();

            var senders = result1.map(function(x) {
                return x.senderId;
            });
            var receivers = result2.map(function (x) {
                return x.receiverId;
            });



            var mostRecentContact;

            if (result1.length>0 && result2.length>0){
                mostRecentContact=result1[0].createdTime > result2[0].createdTime
                    ? result1[0].senderId : result2[0].receiverId;
            }else if(result1.length===0 && result2.length===0){
                mostRecentContact= null;
            }else if(result1.length>0){
                mostRecentContact= result1[0].senderId;
            }else{
                mostRecentContact= result2[0].receiverId;
            }


            var uniqueResult =  _.uniq(senders.concat(receivers));

            if (uniqueResult.length > 0){
                Session.set('MessageSender', mostRecentContact);
            }
            //console.log('uniqueResult',uniqueResult);
            return uniqueResult;
        },
        getLatestMessageFrom: function(id){
            return MESSAGES.find({receiverId: Meteor.userId(), senderId: id}, {sort: {createdTime: -1}, limit: 1});
        },
        checkActive: function (id) {
            if (id == Session.get('MessageSender')){
                return true;
            }else{
                return false;
            }
        }
    })

    Template.messages.events({
        "click .message-user-link": function(e){
            e.preventDefault();

            var userId = lookForAttribute(e.target, 'data-id');
            //console.log('clicked', e.target);
            Session.set('MessageSender', userId);
        },
        'submit .message-form': function (e) {
            e.preventDefault();

            var $input= $("#message-reply");
            var message = $input.val();
            var receiverId = Session.get('MessageSender');

            if (receiverId && message.length > 0){
                Meteor.call('insertMessageForCurrentUser', receiverId, message);
                $input.val('');
            }
        }
    });
}



//-- FUNCTIONS
function isEditMode(){
    if(Meteor.user()){
        if(tagEditable){
            //console.log('returning block');
            return 'inline-block';
        }else{
            //console.log('none');
            return 'none';
        }
    }
}

function convertHex(hex,opacity){
    hex = hex.replace('#','');
    r = parseInt(hex.substring(0,2), 16);
    g = parseInt(hex.substring(2,4), 16);
    b = parseInt(hex.substring(4,6), 16);

    result = 'rgba('+r+','+g+','+b+','+opacity/100+')';
    return result;
}

function lookForAttribute(target, attr, maxTimes){
    !maxTimes ? maxTimes = 5 : '';
    var $this = $(target);
    if ($this.attr(attr)){
        return $this.attr(attr);
    }else{
        if ($this.parent()){
            if (--maxTimes > 0){
                return lookForAttribute($this.parent(), attr, maxTimes)
            }else{
                return null;
            }
        }else{
            return null;
        }
    }
}

function SortByLoginTimes(a, b){
    var aTime = 0;
    if (a.profile && a.profile.loginTimes){
        aTime = a.profile.loginTimes;
    }

    var bTime = 0;
    if (b.profile && b.profile.loginTimes){
        bTime = b.profile.loginTimes;
    }

    return ((aTime < bTime) ? 1 : ((aTime > bTime) ? -1 : 0));
}

function sortByLastLogin(a, b){

    function getTime(user){
        if (user && user.status && user.status.lastLogin && user.status.lastLogin.date){
            return moment(user.status.lastLogin.date).unix();
        }else{
            return 0;
        }
    }

    return getTime(b) - getTime(a);

}

function SortByStatus(a, b){

    function checkUserStatus(user){
        if (user && user.status){
            if (user.status.idle){
                return 1;
            }
            else if (user.status.online){
                return 0;
            }
            else{
                return 2;
            }
        }else{
            return 3;
        }
    }

    var aStatus = checkUserStatus(a);
    var bStatus = checkUserStatus(b);

    return aStatus - bStatus;
}

function SortByLoginTimes(a, b){

    var aT = a.loginTimes;
    var bT = b.loginTimes;

    if (aT && bT){
        return bT - aT;
    }else{
        return 1;
    }

}


//fancy stuff goes down

//function initializeDots() {
//    // Velocity demo
//
//    var isWebkit = /Webkit/i.test(navigator.userAgent),
//        isChrome = /Chrome/i.test(navigator.userAgent),
//        isMobile = !!("ontouchstart" in window),
//        isAndroid = /Android/i.test(navigator.userAgent);
//
//    $.fn.velocity.defaults.easing = "easeInOutSine";
//
//    function r (min, max) {
//        return Math.floor(Math.random() * (max - min + 1)) + min;
//    }
//
//    /* Dots
//     */
//
//    var dotsCount = isMobile ? (isAndroid ? 40 : 50) : (isChrome ? 130 : 80),
//        dotsHtml = "",
//        $count = $("#count"),
//        $dots;
//    //randomGalaxy;
//
//    for (var i = 0; i < dotsCount; i++) {
//        //randomGalaxy = "g" + r(1,16);
//        dotsHtml += '<div class="dot"><img src="images/130/' + (i+1) + '.jpg"></div>';
//    }
//
//    $dots = $(dotsHtml);
//
//    $count.html(dotsCount);
//
//    /*Animation
//     */
//
//    var $container = $("#container"),
//        $description = $("#description"),
//
//        screenWidth = window.screen.availWidth,
//        screenHeight = window.screen.availHeight,
//        chromeHeight = screenHeight - document.documentElement.clientHeight,
//
//        translateZMin = -300,
//        translateZMax = 600;
//
//    $container.css(
//        {
//            //"perspective-origin": screenWidth/2 + "px " + ((screenHeight * 0.45) - chromeHeight) + "px"
//            "perspective-origin": screenWidth * 0.33 + "px " + ((screenHeight * 0.5) - chromeHeight) + "px"
//        }).velocity({
//            perspective: [300,75],
//            opacity: [0.55, 0.35]
//            //rotateZ: [5, 0]
//        },
//        {
//            duration: 1600,
//            loop: true,
//            delay: 4000
//        });
//
//
//    $dots.velocity({
//            translateX: [
//                function () {
//                    return "+=" + r(-screenWidth/2.5, screenWidth/2.5)
//                },
//                function () {
//                    return r(0, screenWidth)
//                }
//            ],
//            translateY: [
//                function () {
//                    return "+=" + r(-screenWidth/2.5, screenWidth/2.5)
//                },
//                function () {
//                    return r(0, screenHeight)
//                }
//            ],
//            translateZ: [
//                function () {
//                    return "+=" + r(translateZMin, translateZMax)
//                },
//                function () {
//                    return r(translateZMin, translateZMax)
//                }
//            ],
//            opacity: [
//                function () {
//                    return Math.random()
//                },
//                function () {
//                    return Math.random() + 0.1
//                }
//            ]},
//        {
//            duration: 30000,
//            loop: true,
//            delay: 0
//        })
//        .velocity('reverse')
//        .appendTo($container);
//
//}