const User=require('../../../models/user')
const jwt=require('jsonwebtoken')


// sign in and create a session for the user
module.exports.createSession =async function(req, res){
    try {
        let user=await User.findOne({email:req.body.email});
        if(!user || user.password != req.body.password){
            return res.json(422,{
                message:"Invalid Username/Password"
            })
        }
        return res.json(200,{
            message:"Sign in successfull, here is your token, please keep it safe",
            data:{
                //sign is a function to convert to encripted key
                token: jwt.sign(user.toJSON(),'codeial',{expiresIn:'10000'})
            }
        })

    } catch (error) {
        console.log('*******',error);
        return res.json(500,{
            message:'Interal Server Error'
        })
    }
    
}