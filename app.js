//core module
const path = require('path');

//external
const express = require('express');
const session = require('express-session');
const mongoDBStore = require('connect-mongodb-session')(session);
const DB_PATH = 'mongodb+srv://root:root@completecoding.d7mjeky.mongodb.net/airbnb?appName=completecoding&compressors=zlib';
const { default: mongoose } = require('mongoose');
const multer= require('multer');

//local
const storeRoute = require('./routes/storeRouter');
const { hostRoute } = require('./routes/hostRouter');
const authRoute = require('./routes/authRouter');
const rootDir = require('./utils/pathUtil');
const errorsController = require('./controllers/errors');
const app = express();
const User = require('./models/users');

app.set('view engine', 'ejs');
app.set('views', 'views');

const store = new mongoDBStore({
    uri: DB_PATH,
    collection: 'sessions'
});

function randomString(n){
    const characters= "abcdefghijklmnopqrstuvwxyz";
    let result= "";
    for(let i=0; i<n; i++){
        result+= characters.charAt(Math.floor(Math.random()*characters.length));
    }
    return result;
}
const multerOption = multer.diskStorage({
    destination : (req, file, cb)=>{cb(null, 'uploads/')},
    filename: (req, file, cb)=>{cb(null, randomString(10)+ "_"+ file.originalname)}
});
const fileFilter= (req, file, cb)=>{
    if(['image/jpeg', 'image/jpg', 'image/png'].includes(file.mimetype)){
        cb(null, true);
    }
    else{
        cb(null, false);
    }
}

app.use(express.urlencoded());
app.use(multer({storage: multerOption, fileFilter}).single('photo'));
app.use(express.static(path.join(rootDir, '/public')));
// app.use((req, res, next) => {
//   if (req.url.includes('/uploads/')) {
//     // Strip everything before /uploads/ to help the static injector find the file
//     req.url = '/uploads/' + req.url.split('/uploads/')[1];
//     return express.static(path.join(rootDir))(req, res, next);
//   }
//   next();
// });
app.use(/.*\/uploads\/(.+)$/ ,(req, res, next)=>{
    req.url= '/'+ req.params[0];
    express.static(path.join(rootDir, 'uploads'))(req, res, next);
});

// app.use('/uploads', express.static(path.join(rootDir, 'uploads')));
// app.use('/host/uploads', express.static(path.join(rootDir, 'uploads')));

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

app.use(async (req, res, next) => {
    try {
        if (req.session.userId) {
            req.user = await User.findById(req.session.userId);
        } else {
            req.user = null;
        }
    } catch (err) {
        req.user = null;
    }
    next();
});

app.use(authRoute);
app.use(storeRoute);
app.use('/host', hostRoute);

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