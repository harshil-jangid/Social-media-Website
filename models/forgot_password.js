const mongoose = require('mongoose');

const ForgotPasswordSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true
    },
    accessToken:{
        type:String
    },
    isValid:{
        type : Boolean,
        default:false
    }
},{
    timestamps: true
});

const ForgotPassword = mongoose.model('ForgotPassword', ForgotPasswordSchema);
module.exports = ForgotPassword;