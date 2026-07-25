//core module
const path = require('path');

//external
const express = require('express');
//local
const storeRoute = require('./routes/storeRouter');
const { hostRoute } = require('./routes/hostRouter');
const rootDir = require('./utils/pathUtil');
const errorsController = require('./controllers/errors');
const { default: mongoose } = require('mongoose');
const app = express();

app.set('view engine', 'ejs'); //we are setting what view engine we r using
app.set('views', 'views'); //we explicityl state which directory has all views/html

app.use(express.urlencoded());//to get form data
app.use("/", storeRoute);
app.use("/host", hostRoute);

app.use(express.static(path.join(rootDir, '/public')));//set public folder

app.use(errorsController.pageNotFound);

const port = 3000;
const DB_PATH="mongodb+srv://root:root@completecoding.d7mjeky.mongodb.net/airbnb?appName=completecoding&compressors=zlib";

mongoose.connect(DB_PATH).then(()=>{
    console.log('MongoDB connected successfully.');
    app.listen(port, () => {
        console.log(`listening at http://localhost:${port}/`);
    });
}).catch(err=>{
    console.log("error while connecting to mongo", err);
});