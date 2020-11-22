const router = require('express').Router();
const validate = require("express-validation");
const baseValidator = require('./../validations/base.validation');
const baseRequestCheck = require('./../middlewares/base-request-check');
const baseController = require('./../controllers/base.controller');

router.post('/prepare', validate(baseValidator), baseRequestCheck, baseController.prepare);
router.post('/complete', validate(baseValidator), baseRequestCheck, baseController.complete);

module.exports = router;