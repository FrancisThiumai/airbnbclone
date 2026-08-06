exports.getLogin = (req, res, next) => {
    res.render('auth/login', { pageTitle: "Login", currentPage: "login", isLoggedIn: false });
}

exports.postLogin = (req, res, next) => {
    req.session.isLoggedIn= true;
    // res.cookie("isLoggedIn", true); //setting cookie key value as true for the specific client storage
    res.redirect('/');
}

exports.postLogout = (req, res, next) =>{
    // res.cookie("isLoggedIn", false); //or we can also do res.clearCookie("isLoggedIn");
    req.session.destroy(err=>{
        if(err){
            console.log(err);
        }
        res.redirect('/login');
    })
}