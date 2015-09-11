/**
 * Created by patrickpu on 9/11/2015.
 */

Meteor.publish('allUserData', function(){
    return Meteor.users.find({});
})

Meteor.publish('allMessages', function(){
    return MESSAGES.find({});
})

Meteor.publish('allTags', function(){
    return TAGS.find({});
})

Meteor.publish('allPhotos', function(){
    return PHOTOS.find({});
})

Meteor.publish('allRelationships', function(){
    return RELATIONSHIPS.find({});
})

Meteor.publish('allLocations', function(){
    return LOCATIONS.find({});
})
