/**
 * Created by patrickpu on 9/11/2015.
 */

if (Meteor.isClient){

    Tracker.autorun(function(){
        Meteor.subscribe('userData');
        Meteor.subscribe('allMessages');
        Meteor.subscribe('allTags');
        Meteor.subscribe('allPhotos');
        Meteor.subscribe('allRelationships');
        Meteor.subscribe('allLocations');
    })

}