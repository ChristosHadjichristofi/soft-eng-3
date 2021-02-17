const express = require('express');

const chargeController = require('../controllers/charge');

const isAuth = require('../middlewares/authentication')
const permit = require('../middlewares/authorization')

const router = express.Router();

router.get('/:license_plate', isAuth, permit('owner'), chargeController.getLicensePlate);

router.post('/completed', chargeController.postCompleted);

module.exports = router;