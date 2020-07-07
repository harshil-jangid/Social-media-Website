const mongoose = require('mongoose');
const env=require('./environment')
mongoose.connect(`mongodb://Localhost/${env.db}`, { useNewUrlParser: true },);

const db = mongoose.connection;

db.on('error',console.error.bind(console,"Error in connectiong to the MongoDB"));

db.once('open',function(){
    console.log('Connected to DataBase :: MongoDB')
});

module.exports = db;