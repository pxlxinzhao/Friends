/**
 * Created by patrickpu on 9/11/2015.
 */

//FRONT END
DIALOG_MESSAGE = 'Default Message';
USER_NUMBER = 0;

//BACK END
USER_LIMIT = 5;


//-- Collections

MESSAGES = new Mongo.Collection("messages");
TAGS = new Mongo.Collection("tags");
PHOTOS = new Mongo.Collection("photos");
RELATIONSHIPS = new Mongo.Collection("relationships");
LOCATIONS = new Mongo.Collection("locations");

