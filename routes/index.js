const express = require('express');
const router = express.Router();
const homeController = require('../controllers/home_controller')
const passport = require('passport');

console.log('Router Loaded');

router.get('/',passport.checkAuthentication,homeController.home);
router.use('/users', require('./users'));
router.use('/posts', require('./posts'));
router.use('/comments', require('./comments'));

module.exports = router;