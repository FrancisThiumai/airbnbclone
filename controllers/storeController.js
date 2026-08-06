//local modules
const Home= require('../models/home');
const Favourite= require('../models/favourite');

exports.getIndex = (req, res, next)=>{
    Home.find().then((homes)=>{ //array of homes given by the find().toArray()
        res.render('store/index', {registeredHomes: homes, pageTitle: 'airbnb Home', currentPage: 'index', isLoggedIn: req.isLoggedIn} );
    }).catch(error=>{
        console.log("error fetching db");
    });
};

exports.getHomes = (req, res, next)=>{
    Home.find().then((homes)=>{ //we don't need the [] to destructure like in mySQL because we get the array directly
        res.render('store/homelist', {registeredHomes: homes, pageTitle: 'Homes List', currentPage: 'homes', isLoggedIn: req.isLoggedIn} );
    });
};

exports.getBookings = (req, res, next)=>{
    res.render('store/bookings', { pageTitle: 'My Bookings', currentPage: 'bookings', isLoggedIn: req.isLoggedIn} );
};

exports.getFavouriteList = (req, res, next)=>{
    Favourite.find()
    .populate('houseId')
    .then((favourites)=>{
        const favouriteHomes = favourites.map(fav=> fav.houseId); //getting only the houseId as array
        console.log(favourites);
            res.render('store/favouriteList', {favouriteHomes: favouriteHomes, pageTitle: 'My Favourites', currentPage: 'favourites', isLoggedIn: req.isLoggedIn} );
    });
};

exports.postAddToFavourite = (req, res, next)=>{
    const homeId= req.body.id;
    Favourite.findOne({houseId: homeId}).then((fav)=>{
        if(!fav){
            fav= new Favourite({houseId: homeId});
            fav.save().then(res=>{console.log("added to favourites", res);
            }).catch(err=>{
                console.log("error while adding to favourite", err);
            });
        }
        else{
            console.log("already marked as favourite");
        }
    }).catch(err=>{
        console.log("err while finding houseId", err);
    }).finally(()=>{
        res.redirect('/homes');
    });

};

exports.postDeleteFavourite= (req, res, next)=>{
    Favourite.findOneAndDelete({ houseId: req.params.homeId }).then((result)=>{
        console.log('favourite removed', result);
    }).catch(err=>{
        console.log('error deleting', err);
    }).finally(()=>{
        res.redirect('/favourites');
    });
}

exports.getHomeDetails = (req, res, next)=>{
    const homeId= req.params.homeId; //this comes from the storeRouter variable homeId which comes from the homeList home object which has id
    Home.findById(homeId).then((home)=>{
        if(!home){
            console.log("home not found");
            res.redirect('/homes');
        }
        else{
            console.log(homeId, home._id);
            res.render('store/homeDetail', {home: home, pageTitle: 'Home Details', currentPage: 'homes', isLoggedIn: req.isLoggedIn});
        }
    });
};