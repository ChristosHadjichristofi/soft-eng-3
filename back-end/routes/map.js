const express = require('express');

const mapController = require('../controllers/map');

//const isAuth = require('../middlewares/auth')

const router = express.Router();

router.get('/show', mapController.getShowMap);

// router.get('/nearest/:cordX/:cordY', mapController.getNearestStations);

module.exports = router;