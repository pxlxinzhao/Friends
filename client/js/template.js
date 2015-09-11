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
        getCurrentUser: getCurrentUser,
        getCity: getCity,
        getStatus: getStatus,
        getUserById: getUserById,
        getDialogMessage: getDialogMessage,
        getLoginTime: getLoginTime
    }

    for (var key in helpers){
        Template.registerHelper(key, helpers[key]);
    }


//LOGIN
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

//EXPLORE RELATED
    Template.explore.helpers({
        getUsersByLastLogin: function () {
            var users = Meteor.users.find({}, {profile: 1, limit: 1000}).fetch();
            users.sort(sortByLastLogin);

            //console.log('explore users', users);
            return users;
        },
        getUsersByLoginTimes: function () {
            var users = Meteor.users.find({}, {profile: 1, limit: 3}).fetch();
            users.sort(SortByLoginTimes);

            //console.log('explore users', users);
            return users;
        },
        getUsersByStatus: function(){
            //SortByStatus
            var users = Meteor.users.find({}, {status: 1, limit: 3}).fetch();
            users.sort(SortByStatus);

            //console.log('explore users', users);
            return users;
        }
    });



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

            console.log(selfIntro);

            setProfile(Meteor.user(), profile);

            console.log('Successfully saved!')
        }
    });

    Template.photoUpdate.events({

        'change input[type="file"]': function(e){
            files = e.currentTarget.files;
        },
        'click #photo-update-btn': function(){
            console.log('clicked', files);

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
                console.log($(this));
                removeMarkerClicked = false;
            }
        },
        'click .photo-remove-marker': function(){
            removeMarkerClicked = true;
        }

    });


//-- MESSAGES
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

            //console.log('uniqueResult',uniqueResult);
            return uniqueResult;
        }
    })

    Template.messages.events({
        "click .message-user-link": function(e){
            e.preventDefault();
            //console.log(e.target);

            //this is really weird..
            var userId = e.target.parentNode.parentNode.getAttribute('data-id');
            if (!userId){
                userId = e.target.parentNode.getAttribute('data-id');
            }
            if (!userId){
                userId = e.target.getAttribute('data-id');
            }
            if(!userId){
                console.error('error trying to get user id');
            }

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

    var aT = a.profile.loginTimes;
    var bT = b.profile.loginTimes;

    if (aT && bT){
        return bT - aT;
    }else{
        return 1;
    }

}

