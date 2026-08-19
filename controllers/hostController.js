//local modules
const Home = require('../models/home')
const fs= require('fs');
const path= require('path')

exports.getAddHome = async (req, res, next) => {
    res.render('host/editHome', { pageTitle: 'Add Home to Airbnb', currentPage: 'addHome', editing: false, isLoggedIn: req.isLoggedIn, user: req.user});
};

exports.postAddHome = (req, res, next) => {
    const { houseName, price, location, rating, description } = req.body;
    if(!req.files['photo']|| !req.files['rules']){
        console.log("no valid image or rules pdf provided");
        res.status(422).redirect('/host/addHome');
    }
    const photo= req.files['photo'][0].path;
    const rules= req.files['rules'][0].path.replace('public/', '');

    const home = new Home({ houseName, price, location, rating, photo, rules, description });
    home.save().then((result) => {
        console.log("Home saved succesfully", result);
    });
    console.log(home);
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
        return res.render('host/editHome', { pageTitle: 'Edit Your Home', currentPage: 'hostHomes', editing: editing, home: home, isLoggedIn: req.isLoggedIn, user: req.user });
    });
};

exports.postEditHome = (req, res, next) => {
    const { id, houseName, price, location, rating, description } = req.body;
    Home.findById(id).then((home) => {
        home.houseName = houseName;
        home.price = price;
        home.location = location;
        home.rating = rating;
        home.description = description;
        if(req.files['photo']){
            fs.unlink(home.photo, (err)=>{
                if(err) console.log("error in deleting/unlinking the photo",err);
            })
            home.photo= req.files['photo'][0].path;
        }
        if(req.files['rules']){
            const rulespath= path.join('public', home.rules);
            fs.unlink(rulespath, (err)=>{
                if(err) console.log("error in deleting/unlinking the photo",err);
            })
            home.rules= req.files['rules'][0].path.replace('public','');
        }

        return home.save().then(result => {
            console.log("home updated", result);
        }).catch(err => {
            console.log("error while saving", err);
        });
    }).catch(err => {
        console.log("error while finding home", err);
    }).finally(()=>{
      res.redirect('/host/hostHomeList');  
    });
}

exports.postDeleteHome = (req, res, next) => {
    const id = req.params.homeId;
    const home= Home.findById(id).then((home)=>{
        if(home.photo){
            fs.unlink(home.photo, (err)=>{
                if(err) console.log("error in deleting/unlinking the photo",err);
            })
        }
        if(home.rules){
            const rulespath= path.join('public', home.rules);
            fs.unlink(rulespath, (err)=>{
                if(err) console.log("error in deleting/unlinking the photo",err);
            })
        }
        return Home.findByIdAndDelete(id).then(() => {
            console.log('done');
        }).catch((error) => {
            console.log('error while deleting', error);
        }).finally(() => {
            res.redirect('/host/hostHomeList');
        });
    })
}

exports.getHostHomes = (req, res, next) => {
    Home.find().then((registeredHomes) => {
        res.render('host/hostHomelist', { registeredHomes: registeredHomes, pageTitle: 'Host Homes List', currentPage: 'hostHomes', isLoggedIn: req.isLoggedIn, user: req.user});
    });
};