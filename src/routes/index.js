const router = require('express').Router();

const baseRoute = require('./base.route');
const invoiceRoute = require('./invoice.route');
const cardRoute = require('./card.route');
const paymentRoute = require('./payment.route');

// This is for Click Shop Api
router.use('/', baseRoute);

// Needs access controll, like jwt token based
router.use('/invoice', invoiceRoute);
router.use('/card', cardRoute);
router.use('/payment', paymentRoute);

module.exports = router;