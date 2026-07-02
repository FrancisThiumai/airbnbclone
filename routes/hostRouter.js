//core module
const path = require('path');

//external module
const express= require('express');
const hostRoute = express.Router();

//local
const rootDir= require('../utils/pathUtil');
const controller= require('../controllers/hostController');

hostRoute.get('/addHome', controller.getAddHome);

hostRoute.post('/addHome', controller.postAddHome);

hostRoute.get('/hostHomeList', controller.getHostHomes);

hostRoute.get('/editHome/:homeId', controller.getEditHome);

hostRoute.post('/editHome', controller.postEditHome);

hostRoute.post('/deleteHome/:homeId', controller.postDeleteHome);

exports.hostRoute= hostRoute;