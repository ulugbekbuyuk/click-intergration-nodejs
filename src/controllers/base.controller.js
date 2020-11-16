const axios = require('axios').default;


module.exports = {
    prepareRequest: async function (req, res, next) {

    },

    completeRequest: async function (req, res, next) {

    },

    cancelPayment: async function (req, res, next) {
        try {
            const { payment_id } = req.body;
            const service_id = ''; //config.service_id;

            const url = 'payment/reversal/' + service_id + '/' + payment_id;
            const axiosResponse = await axios.delete(url);
            // 
            if(axiosResponse.status === 200) {
                // response.data

                return res.status(200).json(axiosResponse.data);
            }
            // return 
        } catch (err) {

        }

    }
}