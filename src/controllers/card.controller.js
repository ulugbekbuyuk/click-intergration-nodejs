const { findByToken, updateByToken, updateById } = require('./../db');
const PaymentStatus = require('./../config/payment-status');
const { ClickError } = require('./../utils/error');
const paymentStatus = require('./../config/payment-status');
const { http } = require('winston');
const axios = require('axios').default;

module.exports = {
    createCard: async function (req, res, next) {
        try {
            const payment = await findByToken(req.body['token']);
            if (payment['status'] !== PaymentStatus.INPUT && payment['status'] !== PaymentStatus.REFUNDED) {
                next(new ClickError('Payment in processing', -31300));
            }
            const url = '';
            const httpResponse = await axios.post(url, {
                'service_id': process.env.SERVICE_ID,
                'card_number': req.body['card_number'],
                'expire_date': req.body['expire_date'],
                'temporary': (!req.body['temporary']) ? 1 : req.body['temporary']
            });

            if (httpResponse.status === 200) {
                const httpData = httpResponse.data;
                if (httpData['error_code'] === 0) {
                    await updateByToken(req.body['token'], {
                        'status': PaymentStatus.CONFIRMED,
                        'status_note': httpData['error_note'],
                        'card_token': httpData['card_token'],
                        'phone_number': httpData['phone_number']
                    });
                } else {
                    await updateByToken(req.body['token'], {
                        'status': PaymentStatus.ERROR,
                        'status_note': httpData['error_note']
                    })
                }
                return res.status(200).json(httpData);
            }
            return next(new ClickError(httpResponse.statusText, ClickError.ERROR_INSUFFICIENT_PRIVILEGE));
        } catch (error) {
            return next(new ClickError('Incorrect request', ClickError.ERROR_METHOD_NOT_FOUND));
        }
    },

    verifyCard: async function (req, res, next) {
        try {
            const payment = await findByToken(req.body['token']);
            if (payment['status'] !== PaymentStatus.WAITING) {
                next(new ClickError('Payment is not stable to perform', ClickError.ERROR_COULD_NOT_PERFORM));
            }
            const url = '';
            const httpResponse = await axios.post(url, {
                'service_id': process.env.SERVICE_ID,
                'card_token': payment['card_token'],
                'sms_code': req.body['sms_code']
            });

            if (httpResponse.status === 200) {
                const httpData = httpResponse.data;
                if (httpData['error_code'] === 0) {
                    await updateByToken(req.body['token'], {
                        'status': paymentStatus.CONFIRMED,
                        'status_note': httpData['error_note'],
                        'card_number': httpData['card_number']
                    });
                } else {
                    await updateByToken(req.body['token'], {
                        'status': paymentStatus.ERROR,
                        'status_note': httpData['error_note']
                    });
                }
                return res.status(200).json(httpData);
            }
            return next(new ClickError(httpResponse.statusText, ClickError.ERROR_INSUFFICIENT_PRIVILEGE));
        } catch (error) {
            return next(new ClickError('Incorrect request', ClickError.ERROR_METHOD_NOT_FOUND));
        }
    },

    paymentWithCard: async function (req, res, next) {
        try {
            const payment = await findByToken(req.body['token']);
            if (payment && payment['card_token'] === req.body['card_token']) {
                await updateById(payment['id'], {
                    'merchant_trans_id': payment['id']
                });
                const url = 'card_token/payment';
                const httpResponse = await axios.post(url, {
                    'service_id': process.env.SERVICE_ID,
                    'card_token': req.body['card_token'],
                    'amount': payment['total'],
                    'merchant_trans_id': payment['id']
                });
                if (httpResponse.status === 200) {
                    const httpData = httpResponse.data;
                    if (httpData['error_code'] === 0) {
                        await updateByToken(req.body['token'], {
                            'status': PaymentStatus.CONFIRMED,
                            'status_note': httpData['error_note'],
                            'payment_id': httpData['payment_id']
                        });
                    } else {
                        await updateByToken(req.body['token'], {
                            'status': PaymentStatus.ERROR,
                            'status_note': httpData['error_note']
                        });
                    }
                    return res.status(200).json(httpData);
                }
                return next(new ClickError(httpResponse.statusText, ClickError.ERROR_INSUFFICIENT_PRIVILEGE));
            }
            return next(new ClickError('Incorrect card token', ClickError.ERROR_COULD_NOT_PERFORM));
        } catch (error) {
            return next(new ClickError('Incorrect request', ClickError.ERROR_METHOD_NOT_FOUND));
        }
    },

    deleteCard: async function (req, res, next) {
        try {
            const payment = await findByToken(req.body['token']);
            if (payment && payment['card_token'] === req.body['card_token']) {
                const url = 'card_token/' + process.env.SERVICE_ID + req.body['card_token'];
                const httpResponse = await axios.delete(url);
                if(httpResponse.status === 200) {
                    const httpData = httpResponse.data;
                    if(httpData['error_code'] === 0) {
                        await updateByToken(req.body['token'], {
                            'card_id': null,
                            'status_note': httpData['error_note']
                        });
                    } else {
                        await updateByToken(req.body['token'], {
                            'status': PaymentStatus.ERROR,
                            'status_note': httpData['error_note']
                        });
                    }
                    return res.status(200).json(httpData);
                }
                return next(new ClickError(httpResponse.statusText, ClickError.ERROR_INSUFFICIENT_PRIVILEGE));
            }
        } catch (error) {
            return next(new ClickError('Incorrect request', ClickError.ERROR_METHOD_NOT_FOUND));
        }
    }
}