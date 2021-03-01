const express = require('express');

const chargeController = require('../controllers/charge');

const isAuth = require('../middlewares/authentication')
const permit = require('../middlewares/authorization')

const router = express.Router();

router.post('/completed', isAuth, permit('owner'), chargeController.postCompleted);

router.get('/stations', isAuth, permit('owner'), chargeController.getStations);

router.get('/points/:stationid', isAuth, permit('owner'), chargeController.getPoints);

router.get('/licenseplates/:ownerid', isAuth, permit('owner'), chargeController.getLicenseplates);

router.get('/ownerid/:username', isAuth, permit('owner'), chargeController.getownerid);

router.get('/vehicletype/:licenseplate', isAuth, permit('owner'), chargeController.getVehicletype);

router.get('/costperkwh/:pointid', isAuth, permit('owner'), chargeController.getCostperkwh);


module.exports = router;