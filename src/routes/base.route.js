const router = require('express').Router();
const { completeRequest } = require('../services/base.service');
// const validator = require('./../validations/invoice.validation');
const baseController = require('./../controllers/base.controller');

router.post('/prepare', baseController.prepare);
router.post('/complete', baseController.complete);

module.exports = router;