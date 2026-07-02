const fs= require('fs');
const path = require('path');
const rootDir = require('../utils/pathUtil');

const favouriteDataPath = path.join(rootDir, 'data', 'favourite.json');

module.exports= class Favourite{
    static addToFavourite(homeId, callback){
        Favourite.getFavourites((favouriteList)=>{
            if(favouriteList.includes(homeId)){
                console.log("Home is already marked favourite");
                callback("Home is already marked favourite");
            }
            else{
                favouriteList.push(homeId);
                fs.writeFile(favouriteDataPath, JSON.stringify(favouriteList), callback);
            }
        });
    };

    static getFavourites(callback){
        fs.readFile(favouriteDataPath, (err, data)=>{
            callback(!err? JSON.parse(data) : []);
        });
    };

    static deleteById(homeId, callback) {
            this.getFavourites((favourites) => {
                favourites = favourites.filter(home => {
                    return home !== homeId;
                });
                fs.writeFile(favouriteDataPath, JSON.stringify(favourites), callback);
            });
        }
};