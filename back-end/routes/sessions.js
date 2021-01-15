const express = require('express');

const sessionsController = require('../controllers/sessions');

const router = express.Router();


router.get('/SessionsPerPoint/:pointID/:yyyymmdd_from/:yyyymmdd_to', sessionsController.getSessionsPerPoint);

// router.get('/SessionsPerStation/:stationID/:yyyymmdd_from/:yyyymmdd_to', sessionsController.getSessionsPerStation);

// router.get('/SessionsPerEV/:vehicleID/:yyyymmdd_from/:yyyymmdd_to', sessionsController.getSessionsPerEV);

// router.get('/SessionsPerProvider/:providerID/:yyyymmdd_from/:yyyymmdd_to', sessionsController.getSessionsPerProvider);

module.exports = router;
