const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const port = 8080;
const db = require('./config/mongoose')
const expressLayouts = require('express-ejs-layouts');
const session = require('express-session');
const passport=require('passport');
const passportLocal=require('./config/passport-local-strategy')
const MongoStore = require('connect-mongo')(session);
const sassMiddleware = require('node-sass-middleware');
const flash=require("connect-flash");
const custonMware=require('./config/middleware');

app.use(sassMiddleware({
    src: './assets/scss',
    dest: './assets/css',
    debug: true,
    outputStyle: 'extended',
    prefix: '/css'
}));
app.use(express.urlencoded());
app.use(cookieParser());
app.use(expressLayouts);
app.use(express.static('./assets'));
app.use('/uploads',express.static(__dirname+'/uploads'));
app.set("layout extractScripts", true)
app.set('layout extractStyles', true);
app.set('view engine','ejs');
app.set('views','./views');

app.use(session({
    name: 'FBook',
    secret:'blah something',
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