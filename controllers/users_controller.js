const User = require('../models/user');
const fs=require("fs");
const path=require("path");

module.exports.profile = function(req, res){
    User.findById(req.params.id,function(err,user){
        return res.render('user_profile', {
            title: 'User Profile',
            profile_user:user
        })
    })
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
        return res.redirect('/users/profile');
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