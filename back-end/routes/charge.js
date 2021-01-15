const express = require('express');

const chargeController = require('../controllers/charge');

//const isAuth = require('../middlewares/auth')

const router = express.Router();

// router.get('/:license_plate', chargeController.getLicensePlate);

// router.post('/completed', chargeController.postCompleted);

module.exports = router;