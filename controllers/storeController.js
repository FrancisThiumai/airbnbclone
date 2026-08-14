//local modules
const Home= require('../models/home');
const User= require('../models/users')

exports.getIndex = (req, res, next)=>{
    Home.find().then((homes)=>{ //array of homes given by the find().toArray()
        res.render('store/index', {registeredHomes: homes, pageTitle: 'airbnb Home', currentPage: 'index', isLoggedIn: req.isLoggedIn, user: req.user} );
    }).catch(error=>{
        console.log("error fetching db");
    });
};

exports.getHomes = (req, res, next)=>{
    Home.find().then((homes)=>{ //we don't need the [] to destructure like in mySQL because we get the array directly
        res.render('store/homelist', {registeredHomes: homes, pageTitle: 'Homes List', currentPage: 'homes', isLoggedIn: req.isLoggedIn, user: req.user} );
    });
};

exports.getBookings = (req, res, next)=>{
    res.render('store/bookings', { pageTitle: 'My Bookings', currentPage: 'bookings', isLoggedIn: req.isLoggedIn, user: req.user} );
};

exports.getFavouriteList = async (req, res, next)=>{
    const user = await User.findById(req.user._id).populate('favourites');

    const favouriteHomes = user.favourites
    res.render('store/favouriteList', {favouriteHomes: favouriteHomes, 
        pageTitle: 'My Favourites', currentPage: 'favourites', 
        isLoggedIn: req.isLoggedIn, user: req.user} );
};

exports.postAddToFavourite = async (req, res, next)=>{
    const homeId= req.body.id;
    const userId= req.user._id;

    const user= await User.findById(req.user._id);
    if(!user.favourites.includes(homeId))
    {
        user.favourites.push(homeId);
        await user.save();
    }
    res.redirect('./favourites');

};

exports.postDeleteFavourite= async (req, res, next)=>{
    const homeId= req.params.homeId;
    // const user= await User.findById(req.user._id);
    // if(user.favourites.includes(homeId)){
    //     user.favourites= user.favourites.filter(fav => fav!=homeId);
    //     await user.save();
    // }

    await User.findByIdAndUpdate(req.user._id, { //we can use built in mongoose method
    $pull: { favourites: homeId }
    });
    res.redirect('/favourites');
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
            res.render('store/homeDetail', {home: home, pageTitle: 'Home Details', currentPage: 'homes', isLoggedIn: req.isLoggedIn, user: req.user});
        }
    });
};