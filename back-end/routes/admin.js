const express = require('express');

const adminController = require('../controllers/admin');

const router = express.Router();


router.post('/usermod/:username/:password', adminController.postUsermod);

router.post('/login', adminController.login);

//router.get('/users/:username', adminController.getUsers);

//router.post('/system/sessionsupd', adminController.postSystem);

//router.get('/healthcheck', adminController.getHealthcheck);

//router.post('/system/resetsessions', adminController.postResetsessions);

module.exports = router;