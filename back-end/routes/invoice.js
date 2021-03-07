const express = require('express');

const invoiceController = require('../controllers/invoice');

const isAuth = require('../middlewares/authentication')
const permit = require('../middlewares/authorization')

const router = express.Router();

router.get('/costenergytotals/:ownerid/:year/:month', isAuth, permit('owner'), invoiceController.getCostenergytotals);

router.get('/chargeslist/:ownerid/:year/:month', isAuth, permit('owner'), invoiceController.getChargeslist);


module.exports = router;