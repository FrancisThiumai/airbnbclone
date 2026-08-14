exports.pageNotFound =(req, res, next)=>{
    // res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
    // res.status(404).sendFile(path.join(rootDir, 'views', '404.html'));
    res.status(404).render('404', {pageTitle: 'page is not found', currentPage: 'error404', isLoggedIn: req.isLoggedIn
        , user: req.user
    });
};