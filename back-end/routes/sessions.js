const express = require('express');

const sessionsController = require('../controllers/sessions');

const isAuth = require('../middlewares/authentication')
const permit = require('../middlewares/authorization')

const router = express.Router();

router.get('/SessionsPerPoint/:pointID/:yyyymmdd_from/:yyyymmdd_to', isAuth, permit('stationadmin', 'sysadmin'), sessionsController.getSessionsPerPoint);

router.get('/SessionsPerStation/:stationID/:yyyymmdd_from/:yyyymmdd_to', isAuth, permit('stationadmin', 'sysadmin'), sessionsController.getSessionsPerStation);

router.get('/SessionsPerEV/:vehicleID/:yyyymmdd_from/:yyyymmdd_to', isAuth, permit('owner', 'sysadmin'), sessionsController.getSessionsPerEV);

router.get('/SessionsPerProvider/:providerID/:yyyymmdd_from/:yyyymmdd_to', isAuth, permit('stationadmin', 'sysadmin'), sessionsController.getSessionsPerProvider);

module.exports = router;
