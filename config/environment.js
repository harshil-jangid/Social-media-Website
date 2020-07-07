const fs= require('fs')
const rfs = require('rotating-file-stream')
const path = require('path')

const logDirectory = path.join(__dirname, '../production_logs');
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

const accessLogStream = rfs.createStream('access.log', {
    interval: '1d',
    path: logDirectory
});

const development = {
    name: 'development',
    asset_path: './assets',
    session_cookie_key: 'blah something',
    db: 'FBook',
    smtp: {
        service:'gmail',
        host:'smtp.gmail.com',
        port:587,
        secure:false,
        auth:{
            user: 'harshlynn90', 
            pass: 'harsh1857'
        }
    },
    google_client_id: "324277542508-m7c8m91rqk8hke16l2jj3k69lpq41s5i.apps.googleusercontent.com",
    google_client_secret: "o4YIaG41gpXh7ZxDtnePJy95",
    google_call_back_url: "http://localhost:8080/users/auth/google/callback",
    jwt_secret: 'FBook',
    morgan: {
        mode: 'dev',
        options: {stream: accessLogStream}
    }
}


const production =  {
    name: 'production',
    asset_path: process.env.FACEGRAM_ASSET_PATH,
    session_cookie_key: process.env.FACEGRAM_SESSION_COOKIE_KEY,
    db: process.env.FACEGRAM_DB,
    smtp: {
        service:'gmail',
        host:'smtp.gmail.com',
        port:587,
        secure:false,
        auth:{
            user: process.env.FACEGRAM_GMAIL_USERNAME, 
            pass: process.env.FACEGRAM_GMAIL_PASSWORD
        }
    },
    google_client_id: process.env.FACEGRAM_GOOGLE_CLIENT_ID,
    google_client_secret: process.env.FACEGRAM_GOOGLE_CLIENT_SECRET,
    google_call_back_url:process.env.FACEGRAM_GOOGLE_CALLBACK_URL,
    jwt_secret: process.env.FACEGRAM_JWT_SECRET,
    morgan: {
        mode: 'combined',
        options: {stream: accessLogStream}
    }
}



module.exports = eval(process.env.FACEGRAM_ENVIRONMENT)== undefined ? development : eval(process.env.FACEGRAM_ENVIRONMENT);