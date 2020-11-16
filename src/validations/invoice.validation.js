const Joi = require('joi');

const createInvoice = {
    body: Joi.object().keys({

    })
};

const checkInvoice = {
    body: Joi.object().keys({

    })
}

module.exports = {
    createInvoice,
    checkInvoice
}