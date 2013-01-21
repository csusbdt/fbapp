# Facebook App

Install the Heroku toolbelt to get the foreman program.

After cloning the project, install the module dependencies with the following command.

    npm install 

Create a facebook app through [developers.facebook.com](developers.facebook.com).

Create file .env with the following contents.
 
    FACEBOOK_APP_ID=<facebook-app-id>
    FACEBOOK_SECRET=<facebook-secret>
    MONGO_HOST=localhost
    MONGO_PORT=27017
    MONGO_DB=fbapp

Install mongodb and create a database named fbapp.

To run, start mongod in a terminal window, and in other termial window, 
run the following.

    foreman start


