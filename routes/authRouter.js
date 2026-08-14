const express= require('express');
const authRouter= express.Router();

const authController= require('../controllers/authController');

authRouter.get('/login', authController.getLogin);
authRouter.post('/login', authController.postLogin);
authRouter.post('/logout', authController.postLogout);
authRouter.get('/sign-up', authController.getSignUp);
authRouter.post('/sign-up', authController.postSignUp);
module.exports= authRouter;