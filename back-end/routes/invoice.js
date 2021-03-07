const express = require('express');

const invoiceController = require('../controllers/invoice');

const isAuth = require('../middlewares/authentication')
const permit = require('../middlewares/authorization')

const router = express.Router();

router.get('/costenergytotals/:ownerid/:year/:month', isAuth, permit('owner'), invoiceController.getCostenergytotals);

router.get('/chargeslist/:ownerid/:year/:month', isAuth, permit('owner'), invoiceController.getChargeslist);

router.get('/adminlist/:administratorid/:year/:month', invoiceController.getAdminlist);
// router.get('/adminlist/:administratorid/:year/:month', isAuth, permit('stationadmin'), invoiceController.getAdminlist);


module.exports = router;