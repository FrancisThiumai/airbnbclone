//local modules
const Home= require('../models/home');
const Favourite= require('../models/favourite');

exports.getIndex = (req, res, next)=>{
    Home.fetchAll().then(([rows, fields])=>{ //fields is not needed here so we don't need to include
        res.render('store/index', {registeredHomes: rows, pageTitle: 'airbnb Home', currentPage: 'index'} );
    }).catch(error=>{
        console.log("error fetching db");
    });
};

exports.getHomes = (req, res, next)=>{
    Home.fetchAll().then(([rows])=>{
        res.render('store/homelist', {registeredHomes: rows, pageTitle: 'Homes List', currentPage: 'homes'} );
    });
};

exports.getBookings = (req, res, next)=>{
    res.render('store/bookings', { pageTitle: 'My Bookings', currentPage: 'bookings'} );
};

exports.getFavouriteList = (req, res, next)=>{
    Favourite.getFavourites((favourites=>{
        Home.fetchAll().then(([registeredHomes])=>{
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
    Home.findById(homeId).then(([homes])=>{
        const home=homes[0];
        if(!home){
            console.log("home not found");
            res.redirect('/homes');
        }
        else{
        res.render('store/homeDetail', {home: home, pageTitle: 'Home Details', currentPage: 'homes'});
        }
    });
};