const fs = require('fs');
const path = require('path');

const rootDir = require('../utils/pathUtil');
const homeDataPath = path.join(rootDir, 'data', 'homes.json');
const db = require('../utils/databaseUtil');

module.exports = class Home {
    constructor(houseName, price, location, rating, photoUrl, description, id) {
        this.houseName = houseName;
        this.price = price;
        this.location = location;
        this.rating = rating;
        this.photoUrl = photoUrl;
        this.description = description;
        this.id = id;
    };
    save() {
        if (!this.id) { //insert
            return db.pool.execute(`INSERT INTO homes(housename, price, location, rating, photourl, description) 
        VALUES(?,?,?,?,?,?)`,
                [this.houseName, this.price, this.location, this.rating, this.photoUrl, this.description]);
        }//need to match the name of field when inserting homes(fake_name1, 2, 3, etc) would not work, we need to use same name but could be case insensitive
        //best to use lowercase field names in db always
        else { //update
            return db.pool.execute(`UPDATE homes SET housename=?, price=?, location=?, rating=?, photourl=?, description=? WHERE id=?`,
                [this.houseName, this.price, this.location, this.rating, this.photoUrl, this.description, this.id]);
        }
    };

    static fetchAll() {
        return db.pool.execute(`SELECT 
        id,
        housename as houseName,
        price,
        location,
        rating,
        photourl as photoUrl,
        description FROM HOMES`); // this returns a promise
    };//if the field name in sql db and home object property name differ use alias like i did above
    //if they r same(case sensitive) can use *(for this particular case) or no alias

    static findById = (homeId) => {
        return db.pool.execute(`SELECT id, housename as houseName, price,
        location, rating, photourl as photoUrl, description FROM homes WHERE id=?`, [homeId]);
    };

    static deleteById(homeId) {
        return db.pool.execute(`DELETE FROM homes WHERE id=?`, [homeId]);
    };
};