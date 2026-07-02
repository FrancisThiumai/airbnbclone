//core module
const path= require('path');

//external
const createApp= require('express');
//local
const storeRoute= require('./routes/storeRouter');
const {hostRoute} = require('./routes/hostRouter');
const rootDir= require('./utils/pathUtil');
const errorsController= require('./controllers/errors');
const db= require('./utils/databaseUtil');

const app= createApp();



app.set('view engine', 'ejs'); //we are setting what view engine we r using
app.set('views', 'views'); //we explicityl state which directory has all views/html
app.use(createApp.static(path.join(rootDir, '/public')));//set public folder

app.use(createApp.urlencoded());//to get form data
app.use("/", storeRoute);
app.use("/host", hostRoute);

app.use(errorsController.pageNotFound);

const port = 3000;
app.listen(port, ()=>{
    console.log(`listening at http://localhost:${port}/`);
});