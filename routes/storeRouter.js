//Core Module
const path= require('path');

//External Module
const express= require('express');
const storeRoute = express.Router();

//local module
const controller= require('../controllers/storeController');

// const rootDir= path.dirname(require.main.filename);// can also do this or import the pathUtil module

storeRoute.get('/', controller.getIndex);

storeRoute.get('/bookings', controller.getBookings);

storeRoute.get('/homes', controller.getHomes);

storeRoute.get('/favourites', controller.getFavouriteList);

storeRoute.get('/homes/:homeId', controller.getHomeDetails);

storeRoute.post('/favourites', controller.postAddToFavourite);

storeRoute.post('/favourite/delete/:homeId', controller.postDeleteFavourite);

module.exports = storeRoute;