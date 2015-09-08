/**
 * Created by Patrick_Pu on 2015-09-05.
 */


if (Meteor.isServer) {
    Meteor.startup(function () {

        Cloudinary.config({
            cloud_name: 'dfmztowxz',
            api_key: '757493586489318',
            api_secret: 'qmMIfRAVtCJ4k3UHpGkbcAfB3yk'
        });

        Meteor.publish('allUserData', function(){
            return Meteor.users.find({});
        })


        Meteor.methods({
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
            }

        });

    });
}