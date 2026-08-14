const { check, validationResult } = require("express-validator");
const User= require('../models/users');
const bcrypt= require('bcryptjs');
const { Error } = require("mongoose");

exports.getLogin = (req, res, next) => {
    res.render('auth/login', { pageTitle: "Login", currentPage: "login", isLoggedIn: false, oldInput: {}, errors: [], user: {}});
};

exports.postLogin = async (req, res, next) => {
    const {email, password} = req.body;
    const user= await User.findOne({email: email});
    if(!user){
        return res.status(422).render("auth/login", {
            pageTitle: "Login",
            currentPage: "login",
            isLoggedIn: false,
            errors: ["user does not exist"],
            oldInput: {email: email},
            user: {}
        });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch){
        return res.status(422).render('auth/login', {
            pageTitle: "Login",
            currentPage: "login",
            isLoggedIn: false,
            errors: ["invalid password"],
            oldInput: {email: email},
            user:{}
        })
    }

    req.session.isLoggedIn= true;
    req.session.userId= user._id.toString();
    // res.cookie("isLoggedIn", true); //setting cookie key value as true for the specific client storage
    await req.session.save();
    res.redirect('/');
};

exports.postLogout = (req, res, next) => {
    // res.cookie("isLoggedIn", false); //or we can also do res.clearCookie("isLoggedIn");
    req.session.destroy(err => {
        if (err) {
            console.log(err);
        }
        res.redirect('/login');
    })
};

exports.getSignUp = (req, res, next) => {
    res.render('auth/signUp', { currentPage: "sign-up", pageTitle: "Sign Up", isLoggedIn: false, oldInput:{}, user: {} });
};

exports.postSignUp = [
    check('firstName')
        // .notEmpty()  no need to check if empty cuz we already checking min length 2
        // .withMessage('first name is required')
        .trim() // removes white spaces
        .isLength({ min: 2 })
        .withMessage("First name should have atleast 2 letters")
        .matches(/^[A-Za-z\s]+$/)
        .withMessage("First name should contain only alphabets"),

    check('lastName')
        .trim() // removes white spaces
        .matches(/^[A-Za-z\s]*$/)
        .withMessage("First name should contain only alphabets"),

    check('email')
        .isEmail()
        .withMessage("please enter a valid email")
        .normalizeEmail(),

    check('password')
        .isLength({ min: 8 })
        .matches(/[A-Z]/)
        .withMessage("Password should contain atleast 1 upper case")
        .matches(/[a-z]/)
        .withMessage("Password should contain atleast 1 lower case")
        .matches(/[!@#]/)
        .withMessage("Password should contain atleast 1 upper case")
        .trim(),

    check('confirmPassword')
        .trim()
        .custom((value, { req }) => {
            if (value !== req.body.password)
                throw new Error("passwords do not match, try again")
            return true
        }),

    check('userType')
        .notEmpty()
        .withMessage("choose a user type")
        .isIn(["guest", "host"])
        .withMessage("invalid user type"),

    check('terms')
        .notEmpty()
        .withMessage("please accept the terms and condition to proceed")
        .custom((value, { req }) => {
            if (value !== "on")
                throw new Error("please accept the terms and conditions to proceed")
            return true;
        }),

    (req, res, next) => {
        const { firstName, lastName, email, password, userType } = req.body;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).render('auth/signUp', {
                currentPage: "sign-up", 
                pageTitle: "Sign Up", 
                isLoggedIn: false, 
                errors: errors.array().map(err => err.msg),
                oldInput: {firstName, lastName, email, userType},
                user:{}
            })
        };

        bcrypt.hash(password, 12)
        .then((hashedPassword)=>{
            const user= new User({firstName, lastName, email, password: hashedPassword, userType});
            return user.save();
        }).then(()=>{
            return res.redirect('/login');
        }).catch(err=>{
            console.log("Error while saving user : ", err.message);
            
            return res.status(422).render('auth/signUp', {
                currentPage: "sign-up", 
                pageTitle: "Sign Up", 
                isLoggedIn: false, 
                errors: [err.message],
                oldInput: {firstName, lastName, email, userType},
                user: {}
            })
        });
    }
]