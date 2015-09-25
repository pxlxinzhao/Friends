/**
 * Created by patrickpu on 9/11/2015.
 */

var max = 0;
var initialLization = true;

Meteor.publish('userData', function(offset, keyword){
    if (!offset){
        offset = 0;
    }

    offset = 1000;

    if (!keyword){
        return Meteor.users.find({}, {limit: offset});
    }else{
        var reg = '/' + keyword + '/';
        console.log('keyword', Meteor.users.find({'profile.name': new RegExp(reg)}, {limit: offset}).count());

        return Meteor.users.find({'profile.name': new RegExp(keyword, 'i')}, {limit: offset})
    }
    //return Meteor.users.find({}, {limit: offset});
})

Meteor.publish('filteredUserData', function(key){

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
