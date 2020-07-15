const express = require('express');
const env= require("./config/environment")
const app = express();
const logger = require('morgan')
require('./config/view-helpers')(app);
const cookieParser = require('cookie-parser');
const port = process.env.port;
const db = require('./config/mongoose')
const expressLayouts = require('express-ejs-layouts');
const session = require('express-session');
const passport=require('passport');
const passportJWT = require('./config/passport-jwt-strategy');
const passportGoogle=require('./config/passport-google-oauth2-strategy')
const passportLocal=require('./config/passport-local-strategy')
const MongoStore = require('connect-mongo')(session);
const sassMiddleware = require('node-sass-middleware');
const flash=require("connect-flash");
const custonMware=require('./config/middleware');
const path= require("path")

if(env.name=='development'){
    app.use(sassMiddleware({
        src: path.join(env.asset_path,"/scss"),
        dest:path.join(env.asset_path,"/css"),
        debug: true,
        outputStyle: 'extended',
        prefix: '/css'
    }));
}

app.use(express.urlencoded({}));
app.use(cookieParser());
app.use(expressLayouts);
app.use(express.static(env.asset_path));
app.use('/uploads',express.static(__dirname+'/uploads'));
app.use(logger(env.morgan.mode, env.morgan.options));

app.set("layout extractScripts", true)
app.set('layout extractStyles', true);
app.set('view engine','ejs');
app.set('views','./views');

app.use(session({
    name: 'FBook',
    secret:env.session_cookie_key,
    saveUninitialized:false,
    resave:false,
    cookie:{
        maxAge:(1000*60*100)
    },
    store: new MongoStore(
        {
            mongooseConnection: db,
            autoRemove: 'disabled'
        
        },
        function(err){
            console.log(err ||  'connect-mongodb setup ok');
        }
    )
}))
app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthenticatedUser);
app.use(flash());
app.use(custonMware.setFlash)

app.use('/',require('./routes'));

app.listen(port, function(err){
    if (err){
        console.log(`Error in running the server: ${err}`);
    }
    console.log(`Server is running on port: ${port}`);
});