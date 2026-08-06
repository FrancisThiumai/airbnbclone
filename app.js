//core module
const path = require('path');

//external
const express = require('express');
const session = require('express-session');
const mongoDBStore = require('connect-mongodb-session')(session);
const DB_PATH = 'mongodb+srv://root:root@completecoding.d7mjeky.mongodb.net/airbnb?appName=completecoding&compressors=zlib';

//local
const storeRoute = require('./routes/storeRouter');
const { hostRoute } = require('./routes/hostRouter');
const authRoute = require('./routes/authRouter');
const rootDir = require('./utils/pathUtil');
const errorsController = require('./controllers/errors');
const { default: mongoose } = require('mongoose');
const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const store = new mongoDBStore({
    uri: DB_PATH,
    collection: 'sessions'
});

app.use(express.urlencoded());

app.use(session({
    secret: 'asdfasdf',
    resave: false,
    saveUninitialized: true,
    store: store
}));

app.use((req, res, next) => {
    req.isLoggedIn = req.session.isLoggedIn;
    next();
});

app.use(authRoute);
app.use(storeRoute);
app.use('/host', hostRoute);

app.use(express.static(path.join(rootDir, '/public')));

app.use(errorsController.pageNotFound);

const port = 3000;

mongoose.connect(DB_PATH).then(() => {
    console.log('MongoDB connected successfully.');
    app.listen(port, () => {
        console.log(`listening at http://localhost:${port}/`);
    });
}).catch(err=>{
    console.log("error while connecting to mongo", err);
});