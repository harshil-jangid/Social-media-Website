const User = require('../models/user');
const fs=require("fs");
const path=require("path");
const passwordmailer=require('../mailers/reset_password');
const jwt=require('jsonwebtoken');

module.exports.profile = function(req, res){
    if(req.params.id){
        User.findById(req.params.id,function(err,user){
            return res.render('user_profile', {
                title: 'User Profile',
                profile_user:user
            })
        })
    }
    else{
        return res.render('user_profile', {
            title: 'User Profile',
            profile_user:user
        })
    }
}

module.exports.signUp = function(req, res){
    if (req.isAuthenticated()){
        return res.redirect('/users/profile');
    }
    return res.render('user_sign_up', {
        title: "Codeial | Sign Up"
    })
}

module.exports.signIn = function(req, res){
    if (req.isAuthenticated()){
        return res.redirect('/users/profile/:id');
    }
    return res.render('user_sign_in', {
        title: "Codeial | Sign In"
    })
}

module.exports.create = function(req, res){
    
    try{        
    //cannot access req.body directly due to multipart thats why this function
            User.uploadedAvatar(req,res,function (err) {
                if (req.body.password != req.body.confirm_password){
                    req.flash('error','Password does not match');
                    return res.redirect('back');
                }
                User.findOne({email:req.body.email},function(err,user){
                    if(err){
                        console.log('error in finding user in signing up');
                        return;
                    }
                    if(!user){
                        User.create({
                            email:req.body.email,
                            name:req.body.name,
                            password:req.body.password,
                            },function(err,user){
                            if(err){
                                console.log('error in creating user while signing up'); 
                                return
                            }
                            if(user){
                                if(req.file){
                                    user.avatar=User.avatarPath + '/' + req.file.filename;
                                }
                                user.save();
                                return res.redirect('/users/sign-in');
                            }
                        })
                    }
                })
            })
                

        } catch (error) {
            req.flash('error',error)
            return res.redirect('back');
        }
    
}
module.exports.update= async function(req,res){
    if(req.user.id == req.params.id){
        try {

            let user = await User.findById(req.params.id)

            //cannot access req.body directly due to multipart thats why this function
            User.uploadedAvatar(req,res,function (err) {
                if(err){
                    console.log('***multer error',err);
                }
                    console.log(user.name,user.email)
                    user.name=req.body.name;
                    user.email=req.body.email;
                    console.log(user.name,user.email)
                    if(req.file){
                        if(user.avatar){
                            fs.unlinkSync(path.join(__dirname,"..",user.avatar))
                        }
                        user.avatar=User.avatarPath + '/' + req.file.filename;
                    }
                    user.save();
                    return res.redirect('back');
            });

        } catch (error) {
            req.flash('error',error)
            return res.redirect('back');
        }
    }else{
        req.flash('error',err);
        return res.redirect('back');
    }
}
module.exports.forgotPassword=function(req,res){
    res.render('passwordreset',);
}

module.exports.resetPassword=function(req,res){
    User.findOne({email:req.body.email},function(err,user){
        if(err){
            console.log('error in finding user for resetting the password');
        }
        if(!user){
            req.flash('error','You need to sign up first/User does not exist in DataBase')
            return res.redirect('back');
        }
        if(user){
            var secret='FBook_password@#$%^';
            var token = jwt.sign(user.toJSON(),secret,{expiresIn:'1000000'})
            var link= `localhost:8080/users/auth/reset/${token}`;
            console.log(secret,link);
            passwordmailer.resetmail(link,user);
            req.flash('success','Password reset link has been sent to your email');
            return res.redirect('/users/sign-in');
            
        }
    })
}
module.exports.checkToken=function(req,res){
    var token = req.params.token;
    var secret='FBook_password@#$%^';
    jwt.verify(token,secret,function(err,payload){
        if(err){
            return res.json(404,{
                message:"Not Authorized"
            })
        }
        if(payload){
            return res.render('FinalResetPage',{
                payload:payload
            })
        }
    })
}

module.exports.updatePassword=function(req,res){
    console.log('in change pass section',req.body.email,req.body.password,req.body.confirm_password);
    if (req.body.password != req.body.confirm_password){
        req.flash('error','Password does not match');
        return res.redirect('back');
    }
    User.findOne({email:req.body.email},function (err,user){
        if(err){
            console.log('error in finding the user to update the password')
            return;
        }
            user.password=req.body.password;
            req.flash('success','Password changed successfully');
            console.log('in change pass section',user.email,user.password);
            user.save();
            return res.redirect('/users/sign-in');

    })
}

// sign in and create a session for the user
module.exports.createSession = function(req, res){
    req.flash('success','Logged in Successfully');
    return res.redirect('/');
}
module.exports.destroySession = function(req, res){
    req.logout();
    req.flash('success','Logged out Successfully');
    return res.redirect('/users/sign-in');
}