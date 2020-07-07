const express = require('express');
const router = express.Router();
const passport = require('passport');
const usersController = require('../controllers/users_controller');

router.get('/profile/:id', passport.checkAuthentication, usersController.profile);
router.get('/profile', passport.checkAuthentication, usersController.profile);
router.get('/sign-up', usersController.signUp);
router.get('/sign-in', usersController.signIn);
router.get('/auth/reset/:token',usersController.checkToken);
router.get('/forgot-password',usersController.forgotPassword);

router.post('/update/:id',passport.checkAuthentication ,usersController.update);
router.post('/reset-password',usersController.resetPassword);
router.post('/changepass',usersController.updatePassword);
router.post('/create', usersController.create);
router.post('/create-session', passport.authenticate(
    'local',
    {failureRedirect: '/users/sign-in'},
), usersController.createSession);
router.get('/sign-out', usersController.destroySession);

router.get('/auth/google',passport.authenticate('google',{scope: ['profile','email']}));
router.get('/auth/google/callback',passport.authenticate('google',{failureRedirect:'/users/sign-in'}),usersController.createSession);

module.exports = router;