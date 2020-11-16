const { prepareRequest, completeRequest } = require('./../services/base.service');

module.exports = {
    prepare: async function (req, res, next) {
        try {
            const result = await prepareRequest(req.body);
        } catch (error) {
            
        }
    },

    complete: async function (req, res, next) {

    }
}