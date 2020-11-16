const axios = require('axios').default;
const { findByToken } = require('./../dbs/mongodb/payment.persistence');
// const {} = require('./../dbs/mysqldb/payment.persistence');  // for MySQL database

const PaymentStatus = Object.freeze({
    INPUT: 'input',
    WAITING: 'waiting',
    PREAUTH: 'preauth',
    CONFIRMED: 'confirmed',
    REJECTED: 'rejected',
    REFUNDED: 'refunded',
    ERROR: 'error'
});

const createInvoice = async (params) => {
    try {
        const { token } = params;
        const data = await findByToken(token);

        if (data['status'] !== PaymentStatus.INPUT && data['status'] !== PaymentStatus.REFUNDED) {
            // 
        }

        const url = 'invoice/status/' + data['service_id'] + '/' + data['invoice_id'];
        const httpResponse = await axios.get(url);

        if(httpResponse.status === 200) {
            const httpData = httpResponse.data;
            if(httpData['error_code'] === 0) {
                //...
            }
        }

    } catch (error) {

    }

}


module.exports = {
    createInvoice
}