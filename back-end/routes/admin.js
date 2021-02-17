const express = require('express');

const adminController = require('../controllers/admin');

const upload = require("../middlewares/upload");
const isAuth = require('../middlewares/authentication')
const permit = require('../middlewares/authorization')

const router = express.Router();


router.post('/usermod/:username/:password', isAuth, permit('sysadmin'), adminController.postUsermod);

router.post('/login', adminController.login);

router.get('/users/:username', isAuth, permit('sysadmin'), adminController.getUser);

router.post('/system/sessionsupd', isAuth, permit('sysadmin'), upload.single("file"), adminController.postSystem);

router.get('/healthcheck', isAuth, permit('sysadmin'), adminController.getHealthcheck);

router.post('/resetsessions', isAuth, permit('sysadmin'), adminController.postResetsessions);

module.exports = router;