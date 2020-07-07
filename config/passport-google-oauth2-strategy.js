const passport=require('passport');
const googleStrategy=require('passport-google-oauth').OAuth2Strategy;
const crypto=require('crypto');
const User=require('../models/user');
const env = require('./environment');


//tell passport to use new google strategy
passport.use(new googleStrategy({
        clientID: env.google_client_id,
        clientSecret: env.google_client_secret,
        callbackURL: env.google_call_back_url
    },
    function(accessToken, refreshToken, profile, done){
        //find the user
        User.findOne({email:profile.emails[0].value}).exec(function(err,user){
            if(err){
                console.log("Error in google strategy-passport",err);
                return;
            }
            console.log(profile);

            //if user found set this user as req.user
            if(user){
                return done(null,user);
            }else{
            //if user not found create the user and set it as req.user
                User.create({
                    name:profile.displayName,
                    email:profile.emails[0].value,
                    password:crypto.randomBytes(20).toString('hex'),
                    avatar:profile.photos[0].value
                },function(err,user){
                    if(err){
                        console.log('Error in creating user',err);
                        return;
                    }else{
                        return done(null,user);
                    }
                })
            }
        })
    }
));

module.exports=passport;