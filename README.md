# Facebook App

Install the Heroku toolbelt to get the foreman program.

After cloning the project, install the module dependencies with the following command.

    npm install 

Create a facebook app through [developers.facebook.com](developers.facebook.com).

Create file .env with the following contents.
 
    FACEBOOK_APP_ID=<facebook-app-id>
    FACEBOOK_SECRET=<facebook-secret>
    MONGO_URI=mongodb://localhost:27017/fbapp

Install mongodb and create a database named _fbapp_.

To run, start mongodb in a terminal window, and in other termial window, 
run the following.

    foreman start


