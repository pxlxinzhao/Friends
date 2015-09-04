/**
 * Created by patrickpu on 9/4/2015.
 */


if (Meteor.isClient){

    Template.explore.helpers({
        getUsers: function () {
            var users = Meteor.users.find().fetch();
            return users;
        }
    });

}