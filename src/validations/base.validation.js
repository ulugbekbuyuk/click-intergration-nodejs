const Joi = require("joi");

const baseRequest = {
  body: Joi.object().keys({
    click_trans_id: Joi.number().required(),
    service_id: Joi.number().required(),
    click_paydoc_id: Joi.number().required(),
    merchant_trans_id: Joi.string().required(),
    amount: Joi.number().required(),
    action: Joi.number().required(),
    merchant_prepare_id: Joi.alternatives().when("action", {
      is: 1,
      then: Joi.number().required(),
      otherwise: Joi.allow('', null, undefined),
    }),
    error: Joi.number().required(),
    error_note: Joi.string().required(),
    sign_time: Joi.date().format("YYYY-MM-DD HH:mm:ss").required(),
    sign_string: Joi.string().required(),
  })
};

module.exports = baseRequest;