/**
 * Created by patrickpu on 9/11/2015.
 */



ServiceConfiguration.configurations.remove({
    service: 'facebook'
});

ServiceConfiguration.configurations.insert({
    service: 'facebook',
    appId: '899773626737808',
    secret: 'e6b0bd5198c5544fa4527575b3bec9be'
});


Meteor.startup(function () {

    Cloudinary.config({
        cloud_name: 'dfmztowxz',
        api_key: '757493586489318',
        api_secret: 'qmMIfRAVtCJ4k3UHpGkbcAfB3yk'
    });


    //fakeUser(10);
});



function fakeUser(quantity){

    for (var i=0; i<quantity; i++){
        console.log('faking user');
        var user = Fake.user({
            fields: ['name', 'username', 'emails.address', 'profile.name'],
        });
        Meteor.users.insert(user);
    }

}