const express = require('express');
const app = express();
const port = 8080;
const expressLayouts = require('express-ejs-layouts');


app.set('view engine','ejs');
app.set('views','./views');
app.use(expressLayouts);
app.set("layout extractScripts", true)
app.set('layout extractStyles', true);

app.use('/',require('./routes'));

app.listen(port, function(err){
    if (err){
        console.log(`Error in running the server: ${err}`);
    }
    console.log(`Server is running on port: ${port}`);
});