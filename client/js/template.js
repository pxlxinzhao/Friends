/**
 * Created by patrickpu on 9/4/2015.
 */


if (Meteor.isClient){

    Template.explore.helpers({
        getUsers: function () {
            var users = Meteor.users.find().fetch();

            users.sort(SortByStatus);

            console.log(users);

            return users;
        }
    });

    function SortByLiveness(a, b){
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

    function SortByStatus(a, b){
        var aStatus = false;
        if (a.profile && a.profile.isOnline){
            aStatus = a.profile.isOnline;
        }

        var bStatus = false;
        if (b.profile && b.profile.isOnline){
            bStatus = b.profile.isOnline;
        }

        return aStatus === bStatus ? 0 : aStatus === true ? -1 : 1;
    }

}