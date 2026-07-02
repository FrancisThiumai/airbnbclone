const mysql= require('mysql2');

const pool = mysql.createPool({
    host:"localhost", //where the database is hosted
    user:"root",
    password:"thiumaifrancis",
    database:"airbnb"
});

module.exports= pool.promise();