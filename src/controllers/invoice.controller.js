const invoiceService = require('./../services/invoice.service');

module.exports = {
    createInvoice: async function(req, res, next) {
        try {
            const result = await invoiceService.createInvoice(req.body);
            if(!result) return res.status(200).json(result);
        } catch (err) {
            
        }
    },

    checkInvoice: async function(req, res, next) {

    }
}