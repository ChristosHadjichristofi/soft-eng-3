const express = require('express');

const chargeauxController = require('../controllers/chargeaux');

const isAuth = require('../middlewares/authentication')
const permit = require('../middlewares/authorization')

const router = express.Router();

router.get('/stations', chargeauxController.getStations);

router.get('/points/:stationid', chargeauxController.getPoints);

router.get('/licenseplates/:ownerid', chargeauxController.getLicenseplates);

router.get('/ownerid/:username', chargeauxController.getownerid);

router.get('/vehicletype/:licenseplate', chargeauxController.getVehicletype);

module.exports = router;