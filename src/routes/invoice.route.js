const { Router } = require('express');

const router = require('express').Router();
const controller = require('./../controllers/invoice.controller');

router.post('/create', controller.createInvoice);
router.post('/check', controller.checkInvoice);

module.exports = router;