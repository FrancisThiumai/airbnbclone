//local modules
const Home = require('../models/home')

exports.getAddHome = (req, res, next) => {
    res.render('host/editHome', { pageTitle: 'Add Home to Airbnb', currentPage: 'addHome', editing: false, isLoggedIn: req.isLoggedIn});
};

exports.postAddHome = (req, res, next) => {
    const { houseName, price, location, rating, photoUrl, description } = req.body;
    const home = new Home({ houseName, price, location, rating, photoUrl, description });//the mongoose made model expects an already made object not fields
    home.save().then((result) => {
        console.log("Home saved succesfully", result);
    });
    res.redirect('/host/hostHomeList');
};

exports.getEditHome = (req, res, next) => {
    const homeId = req.params.homeId;
    const editing = req.query.editing === 'true';

    Home.findById(homeId).then((home) => {
        if (!home) {
            console.log("Home is not found");
            return res.redirect('/host/hostHomeList');
        }
        return res.render('host/editHome', { pageTitle: 'Edit Your Home', currentPage: 'hostHomes', editing: editing, home: home, isLoggedIn: req.isLoggedIn });
    });
};

exports.postEditHome = (req, res, next) => {
    const { id, houseName, price, location, rating, photoUrl, description } = req.body;
    Home.findById(id).then((home) => {
        home.houseName = houseName;
        home.price = price;
        home.location = location;
        home.rating = rating;
        home.photoUrl = photoUrl;
        home.description = description;

        return home.save().then(result => {
            console.log("home updated", result);
        }).catch(err => {
            console.log("error while saving", err);
        });
    }).catch(err => {
        console.log("error while finding home", err);
    });
    res.redirect('/host/hostHomeList');
}

exports.postDeleteHome = (req, res, next) => {
    const id = req.params.homeId;
    Home.findByIdAndDelete(id).then(() => {
        console.log('done');
    }).catch((error) => {
        console.log('error while deleting', error);
    }).finally(() => {
        res.redirect('/host/hostHomeList');
    });
}

exports.getHostHomes = (req, res, next) => {
    Home.find().then((registeredHomes) => {
        res.render('host/hostHomelist', { registeredHomes: registeredHomes, pageTitle: 'Host Homes List', currentPage: 'hostHomes', isLoggedIn: req.isLoggedIn});
    });
};