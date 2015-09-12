/**
* Created by Patrick_Pu on 2015-09-05.
*/


Meteor.startup(function () {


    Meteor.methods({

        countUser: function(){
          return Meteor.users.find().count();
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

            reverseGeoCode({lat: position.latitude, lng: position.longitude})
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

function reverseGeoCode(latlng){
    var geo = new GeoCoder();
    var location = geo.reverse(latlng.lat, latlng.lng);

    if (Meteor.userId()){

        LOCATIONS.upsert({_id: Meteor.userId()}, {$set: {address: location}})

    }

}