const express = require('express');

const adminController = require('../controllers/admin');

const isAuth = require('../middlewares/auth')

const router = express.Router();


router.post('/usermod/:username/:password', isAuth, adminController.postUsermod);

router.post('/login', adminController.login);

router.get('/users/:username', isAuth, adminController.getUser);

//router.post('/system/sessionsupd', adminController.postSystem);

router.get('/healthcheck', isAuth, adminController.getHealthcheck);

//router.post('/system/resetsessions', adminController.postResetsessions);

module.exports = router;