/**
* Created by Patrick_Pu on 2015-09-05.
*/


Meteor.startup(function () {


    Meteor.methods({

        countUser: function(){
          return Meteor.users.find().count();
        },

        reverseGeoCode: function(latlng){
            var geo = new GeoCoder();
            var location = geo.reverse(latlng.lat, latlng.lng);

            //console.log('location', location);

            if (Meteor.userId()){
                var user = Meteor.users.findOne({_id: Meteor.userId()});
                var profile = user.profile;

                if (!profile){
                    profile = {};
                }

                profile.location = location;

                Meteor.users.update({_id: user._id}, {$set: {profile: profile}});
                //setProfile(user, profile);
            }

        },
//USER
        loginSetup: function(position){

            var times = Meteor.user().loginTimes;
            var logintTimes = times ? times + 1 : 1;
            var time = moment().valueOf();

            console.log('set up time: ', logintTimes, time);
            Meteor.users.upsert({_id: Meteor.userId()}, {$set: {loginTimes: logintTimes, lastLoginTime: time}});

        },

        setLocation: function(position){
            console.log('set up position: ', position);

            LOCATIONS.upsert({_id: Meteor.userId()}, {$set: {position: position}})
        },


//TAGS
        insertTagsForCurrentUser: function (tags) {
            //console.log('inserting', tags);
            TAGS.insert({
                userId: Meteor.userId(),
                tags:tags
            })
        },
        updateTagsForCurrentUser: function (tags) {
            //console.log('inserting', tags);
            TAGS.update({
                userId: Meteor.userId()
            }, {$set: {tags: tags}})
        },


//PHOTO
        updatePhotoForCurrentUser: function(obj){
            PHOTOS.insert({
                userId: Meteor.userId(),
                c:obj
            })
        },


//MESSAGES
        insertMessageForCurrentUser: function(receiverId, message){
            MESSAGES.insert({
                senderId: Meteor.userId(),
                receiverId: receiverId,
                message: message,
                createdTime: moment().valueOf()
            });
        }

    });

});
