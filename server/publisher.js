/**
 * Created by patrickpu on 9/11/2015.
 */

var max = 0;
var initialLization = true;

Meteor.publish('userData', function(offset){
    if (!offset){
        offset = 0;
    }

    return Meteor.users.find({}, {limit: offset});
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
