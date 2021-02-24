const express = require('express');

const adminController = require('../controllers/admin');

const upload = require("../middlewares/upload");
const isAuth = require('../middlewares/authentication')
const permit = require('../middlewares/authorization')

const router = express.Router();


router.post('/usermod/:username/:password', isAuth, permit('sysadmin'), adminController.postUsermod);

router.post('/login', adminController.login);

router.get('/users/:username', adminController.getUser);

router.post('/system/sessionsupd', upload.single("file"), adminController.postSystem);

router.get('/healthcheck', adminController.getHealthcheck);

router.post('/resetsessions', adminController.postResetsessions);

module.exports = router;