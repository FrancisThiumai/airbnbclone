const fs = require('fs');
const path = require('path');
const rootDir = require('../utils/pathUtil');

const homeDataPath = path.join(rootDir, 'data', 'homes.json');

module.exports = class Home {
    constructor(houseName, price, location, rating, photoUrl) {
        this.houseName = houseName;
        this.price = price;
        this.location = location;
        this.rating = rating;
        this.photoUrl = photoUrl;
    };
    save() {
        Home.fetchAll((registeredHomes) => {
            if (this.id) { //checking if id is already assigned or not
                registeredHomes = registeredHomes.map(home =>// map does not mutate original array, it returns new one 
                    //so the old array is no longer referenced by other variables in code, the GC clears it, and map returns a new array
                    home.id === this.id ? this : home);
            } else {
                this.id = Math.random().toString();
                registeredHomes.push(this);
            }
            fs.writeFile(homeDataPath, JSON.stringify(registeredHomes), (error) => {
                console.log('file writing concluded', error);
            });
        });
    };

    static fetchAll(callback) {
        fs.readFile(homeDataPath, (err, data) => {
            callback(!err ? JSON.parse(data) : []);
        });
    };

    static findById = (id, callback) => {
        this.fetchAll((registeredHomes) => {
            const reqdHomeData = registeredHomes.find((home) => home.id === id);
            callback(reqdHomeData);
        });
    };

    static deleteById(homeId, callback) {
        this.fetchAll((registeredHomes) => {
            registeredHomes = registeredHomes.filter(home => {
                return home.id !== homeId; //if home.id does not match it will pass filter n go on resulting array, 
                // if matched,i.e., false it will not be included
                // registeredHomes = registeredHomes.map(home => {
                //     return home.id === homeId ? null : home;
                // }).filter(home => home !== null);
            });
            fs.writeFile(homeDataPath, JSON.stringify(registeredHomes), callback);
        });
    }
};