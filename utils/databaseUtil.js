const mysql= require('mysql2');

exports.pool = mysql.createPool({
    host:"localhost", //where the database is hosted
    user:"root", //what user is accessing the db
    password:"thiumaifrancis", //the password
    database:"airbnb" //the database name
}).promise();

// module.exports= pool.promise();