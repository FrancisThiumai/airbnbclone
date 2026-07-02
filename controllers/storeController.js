//local modules
const Home= require('../models/home');
const Favourite= require('../models/favourite');

exports.getIndex = (req, res, next)=>{
    const registeredHomes= Home.fetchAll(registeredHomes=>{
        res.render('store/index', {registeredHomes: registeredHomes, pageTitle: 'airbnb Home', currentPage: 'index'} );
    });
};

exports.getHomes = (req, res, next)=>{
    const registeredHomes= Home.fetchAll(registeredHomes=>{
        res.render('store/homelist', {registeredHomes: registeredHomes, pageTitle: 'Homes List', currentPage: 'homes'} );
    });
};

exports.getBookings = (req, res, next)=>{
    res.render('store/bookings', { pageTitle: 'My Bookings', currentPage: 'bookings'} );
};

exports.getFavouriteList = (req, res, next)=>{
    Favourite.getFavourites((favourites=>{
        Home.fetchAll(registeredHomes=>{
            const favouriteHomes= registeredHomes.filter(home => favourites.includes(home.id));
            res.render('store/favouriteList', {favouriteHomes: favouriteHomes, pageTitle: 'My Favourites', currentPage: 'favourites'} );
        });
    }));
};

exports.postAddToFavourite= (req, res, next) => {
    
    Favourite.addToFavourite(req.body.id, (err)=>{
        if(err){
            console.log("err while marking favourite", err);
        };
        res.redirect('/favourites');
    });
};

exports.postDeleteFavourite= (req, res, next)=>{
    Favourite.deleteById(req.params.homeId, err=>{
        if(err)
            console.log('error deleting');
    })
    res.redirect('/favourites');
}

exports.getHomeDetails = (req, res, next)=>{
    const homeId= req.params.homeId; //this comes from the storeRouter variable homeId which comes from the homeList home object which has id
    Home.findById(homeId, (homeData)=>{
        if(!homeData){
            console.log("home not found");
            res.redirect('/homes');
        }
        else{
        res.render('store/homeDetail', {home: homeData, pageTitle: 'Home Details', currentPage: 'homes'});
        }
    });
};