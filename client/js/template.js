/**
 * Created by patrickpu on 9/4/2015.
 */

var tagEditable = false;
var files = null;

if (Meteor.isClient){

//-- Register global helpers

    var helpers = {
        getUsername: getUsername,
        getCurrentUserId: getCurrentUserId,
        getEmail: getEmail,
        //getCurrentUser: getCurrentUser,
        getCity: getCity,
        getStatus: getStatus,
        getUserById: getUserById,
        getUsernameById: getUsernameById,
        getDialogMessage: getDialogMessage,
        getLoginTime: getLoginTime
    }

    for (var key in helpers){
        Template.registerHelper(key, helpers[key]);
    }

//NAVIGATION

    Template.navigation.onRendered(function(){
        $(".button-collapse").sideNav();

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

        //$('.modal-trigger').leanModal();
    });

    Template.navigation.events({
        'click .logout-btn': function(e){
            //e.preventDefault();
            AccountsTemplates.logout();
            window.location.replace('http://localhost:3000');
        },
        'click .modal-trigger': function () {
            $('#modal1').openModal();
        },
        'submit #search-form': function (event) {
            event.preventDefault();
            var value = $("#search").val();
            Session.set('userOffset', 10);
            Session.set('keyword', value);
            //Meteor.subscribe('filteredUserData', value);
            //Blaze.render('explore');
        }
    });

//LOGIN
//    Template.login.events({
//        'click #facebook-login': function(event) {
//            Meteor.loginWithFacebook({}, function(err){
//                if (err) {
//                    throw new Meteor.Error("Facebook login failed");
//                }
//            });
//        },
//
//        'click #logout': function(event) {
//            Meteor.logout(function(err){
//                if (err) {
//                    throw new Meteor.Error("Logout failed");
//                }
//            })
//        }
//    });

//Welcome
    Template.welcome.onRendered(function () {

        //try{
        //    initializeDots();
        //}catch (e){
        //    console.log(e);
        //}

        $('.nav').velocity({
            backgroundColorAlpha: 0
        }, 0);
        $('footer').velocity({
            opacity: 0
        }, 0);

        //$('#fullpage').fullpage({
        //    verticalCentered: false,
        //    scrollOverflow: false,
        //    navigationTooltips: ['firstSlide', 'secondSlide'],
        //    slidesNavigation: true,
        //    onLeave: function(index, nextIndex, direction){
        //        var leavingSection = $(this);
        //        if(index == 1 && direction =='down'){
        //            $nav.velocity({
        //                backgroundColorAlpha: 1
        //            });
        //        }
        //        else if(index == 2 && direction == 'up'){
        //            $nav.velocity({
        //                backgroundColorAlpha: 0
        //            });
        //        }
        //    }
        //});

        $(".fullpage-title").children()
            .velocity("transition.slideLeftIn", { stagger: 1800 }, 1000)
            .delay(750);

        $('.fullpage-right .btn').click(function () {
            $('#modal1').openModal();
        });
    });

//EXPLORE RELATED
    Template.explore.created = function(){
        Session.set('userOffset', 10);
        Session.set('keyword', '');

        //Deps.autorun(function(){
        //    console.log('keyword', Session.get('keyword'));
        //    Meteor.subscribe('userData', Session.get('userOffset'), Session.get('keyword'));
        //});
    }

    Template.explore.helpers({
        getUsersByLastLogin: function () {
            var users = Meteor.users.find({_id: {$ne: Meteor.userId()}}, {profile: 1, limit: 1000}).fetch();
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

    Template.photoUpdate.events({

        'change input[type="file"]': function(e){
            files = e.currentTarget.files;
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
                Meteor.call('likeUser', userId);
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
            var photo = $(this)[0];
            if (photo){
                Meteor.call('updatePhotoUrl', photo, function(err){
                    if (err){
                        console.error(err);
                    }else{
                        var nId = Notifications.success('updated profile picture');
                        removeNotification(nId);
                    }
                });
            }

        }

    });


//-- MESSAGES
    Template.messages.onRendered(function () {
        //$('.button-collapse').sideNav({
        //        menuWidth: 300, // Default is 240
        //        edge: 'right', // Choose the horizontal origin
        //        closeOnClick: true // Closes side-nav on <a> clicks, useful for Angular/Meteor
        //    }
        //);
    });

    Template.messages.helpers({
        getMessage: function(){
            //console.log('Session messaggSender: ',Session.get('MessageSender'));
            return MESSAGES.find({receiverId: Meteor.userId(), senderId: Session.get('MessageSender')}, {sort: {createdTime: -1}}).fetch();
        },
        getMessageSendersForCurrentUser: function(){
            var result = MESSAGES.find({receiverId: Meteor.userId()}, {sort: {createdTime: -1}, fields: {"senderId": 1}}).fetch();
            var uniqueResult =  _.uniq(result.map(function(x) {
                return x.senderId;
            }), true)

            if (uniqueResult.length > 0){
                Session.set('MessageSender', uniqueResult[0]);
            }
            //console.log('uniqueResult',uniqueResult);
            return uniqueResult;
        }
    })

    Template.messages.events({
        "click .message-user-link": function(e){
            e.preventDefault();
            //console.log(e.target.getAttribute('data-id'));

            var userId = e.target.getAttribute('data-id');
            Session.set('MessageSender', userId);
        }
    });

    Template.messageEntry.helpers({
        formatTime: function(str){
            var result = moment(str).format('YYYY-MM-DD HH:mm:ss');
            //console.log('resutl', str);
            return result;
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

function convertHex(hex,opacity){
    hex = hex.replace('#','');
    r = parseInt(hex.substring(0,2), 16);
    g = parseInt(hex.substring(2,4), 16);
    b = parseInt(hex.substring(4,6), 16);

    result = 'rgba('+r+','+g+','+b+','+opacity/100+')';
    return result;
}

function initializeDots() {
    // Velocity demo

    var isWebkit = /Webkit/i.test(navigator.userAgent),
        isChrome = /Chrome/i.test(navigator.userAgent),
        isMobile = !!("ontouchstart" in window),
        isAndroid = /Android/i.test(navigator.userAgent);

    $.fn.velocity.defaults.easing = "easeInOutSine";

    function r (min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    /* Dots
     */

    var dotsCount = isMobile ? (isAndroid ? 40 : 50) : (isChrome ? 130 : 80),
        dotsHtml = "",
        $count = $("#count"),
        $dots;
    //randomGalaxy;

    for (var i = 0; i < dotsCount; i++) {
        //randomGalaxy = "g" + r(1,16);
        dotsHtml += '<div class="dot"><img src="images/130/' + (i+1) + '.jpg"></div>';
    }

    $dots = $(dotsHtml);

    $count.html(dotsCount);

    /*Animation
     */

    var $container = $("#container"),
        $description = $("#description"),

        screenWidth = window.screen.availWidth,
        screenHeight = window.screen.availHeight,
        chromeHeight = screenHeight - document.documentElement.clientHeight,

        translateZMin = -300,
        translateZMax = 600;

    $container.css(
        {
            //"perspective-origin": screenWidth/2 + "px " + ((screenHeight * 0.45) - chromeHeight) + "px"
            "perspective-origin": screenWidth * 0.33 + "px " + ((screenHeight * 0.5) - chromeHeight) + "px"
        }).velocity({
            perspective: [300,75],
            opacity: [0.55, 0.35]
            //rotateZ: [5, 0]
        },
        {
            duration: 1600,
            loop: true,
            delay: 4000
        });


    $dots.velocity({
            translateX: [
                function () {
                    return "+=" + r(-screenWidth/2.5, screenWidth/2.5)
                },
                function () {
                    return r(0, screenWidth)
                }
            ],
            translateY: [
                function () {
                    return "+=" + r(-screenWidth/2.5, screenWidth/2.5)
                },
                function () {
                    return r(0, screenHeight)
                }
            ],
            translateZ: [
                function () {
                    return "+=" + r(translateZMin, translateZMax)
                },
                function () {
                    return r(translateZMin, translateZMax)
                }
            ],
            opacity: [
                function () {
                    return Math.random()
                },
                function () {
                    return Math.random() + 0.1
                }
            ]},
        {
            duration: 30000,
            loop: true,
            delay: 0
        })
        .velocity('reverse')
        .appendTo($container);

}