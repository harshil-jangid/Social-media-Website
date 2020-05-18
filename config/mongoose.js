const mongoose = require('mongoose');

mongoose.connect('mongodb://Localhost/FBook', { useNewUrlParser: true },);

const db = mongoose.connection;

db.on('error',console.error.bind(console,"Error in connectiong to the MongoDB"));

db.once('open',function(){
    console.log('Connected to DataBase :: MongoDB')
});

module.exports = db;