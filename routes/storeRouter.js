//Core Module
const path= require('path');

//External Module
const express= require('express');
const storeRoute = express.Router();

//local module
const controller= require('../controllers/storeController');

storeRoute.get('/', controller.getIndex);

storeRoute.get('/bookings', controller.getBookings);

storeRoute.get('/homes', controller.getHomes);

storeRoute.get('/favourites', controller.getFavouriteList);

storeRoute.get('/homes/:homeId', controller.getHomeDetails);

storeRoute.post('/favourites', controller.postAddToFavourite);

storeRoute.post('/favourite/delete/:homeId', controller.postDeleteFavourite);

storeRoute.get('/rules/:homeId', controller.getHouseRules);

module.exports = storeRoute;