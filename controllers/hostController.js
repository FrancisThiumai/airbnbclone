//local modules
const Home = require('../models/home')
const Favourite= require('../models/favourite');

exports.getAddHome = (req, res, next) => {
    res.render('host/editHome', { pageTitle: 'Add Home to Airbnb', currentPage: 'addHome', editing: false });
};

exports.postAddHome = (req, res, next) => {
    const { houseName, price, location, rating, photoUrl, description} = req.body;
    const home = new Home(houseName, price, location, rating, photoUrl, description);
    home.save();
    res.redirect('/host/hostHomeList');
};

exports.getEditHome = (req, res, next) => {
    const homeId = req.params.homeId;
    const editing = req.query.editing === 'true'; //if the editing string query is true then editing variable is now boolean true

    Home.findById(homeId).then(([homes]) => {
        const homeData=homes[0];
        if (!homeData) {
            console.log("Home is not found");
            return res.redirect('/host/hostHomeList');
        }   //we can either return or use else otherwise the it will try to send two responses and give error 
        return res.render('host/editHome', { pageTitle: 'Edit Your Home', currentPage: 'hostHomes', editing: editing, home: homeData });
    });
};

exports.postEditHome = (req, res, next) => {

    const { id, houseName, price, location, rating, photoUrl, description } = req.body;
    const home = new Home(houseName, price, location, rating, photoUrl, description, id);
    //const houseid= req.body.id; this also works
    //const id = req.body; this also works as new var name is same as existing in req.body, it maps/assigns its value to it
    //however {id, housesnamessss}= req.body; the id would get the value however the second var would not as the name is not
    //matching any existing property name in the req.body object
    home.save();
    res.redirect('/host/hostHomeList');
}

exports.postDeleteHome = (req, res, next) => {
    const id = req.params.homeId;
    Home.deleteById(id).then(()=>{  //in then there can't be error, it will be in catch
        res.redirect('/host/hostHomeList');
    }).catch((error)=>{
        console.log('error while deleting', error);
    });
}

exports.getHostHomes = (req, res, next) => {
    Home.fetchAll().then(([registeredHomes])=>{ 
        res.render('host/hostHomelist', { registeredHomes: registeredHomes, pageTitle: 'Host Homes List', currentPage: 'hostHomes' });
    });
};