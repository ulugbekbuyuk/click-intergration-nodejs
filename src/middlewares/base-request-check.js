const { findByMerchantTransId, findById } = require("./../db");
const PaymentStatus = require("./../config/payment-status");
const { ClickError } = require('./../utils/error');

module.exports = async (req, res, next) => {
  try {
    const sign_string = md5(
      req.body["click_trans_id"] +
        req.body["service_id"] +
        process.env.SECRET_KEY +
        req.body["merchant_trans_id"] +
        (req.body["action"] === 1 ? req.body["merchant_prepare_id"] : "") +
        req.body["amount"] +
        req.body["action"] +
        req.body["sign_time"]
    );

    if (sign_string !== req.body["sign_string"]) {
      Object.assign(req, {
        error: -1,
        error_note: "SIGN CHECK FAILED!",
      });
      next();
    }

    if (!(req.body["action"] === 0 || req.body["action"] === 1)) {
      Object.assign(req, {
        error: -3,
        error_note: "Action not found",
      });
      next();
    }

    let payment = await findByMerchantTransId(reqBody["merchant_trans_id"]);
    if (!payment) {
      Object.assign(req, {
        error: -5,
        error_note: "User does not exist",
      });
      next();
    }

    if (req.body["action"] === 1) {
      payment = await findById(req.body["merchant_prepare_id"]);
      if (!payment) {
        Object.assign(req, {
          error: -6,
          error_note: "Transaction does not exist",
        });
        next();
      }
    }

    if (payment["status"] === PaymentStatus.CONFIRMED) {
      Object.assign(req, {
        error: -4,
        error_note: "Already paid",
      });
      next();
    }

    if (Math.abs(payment["total"] - req.body["amount"]) > 0.1) {
      Object.assign(req, {
        error: -2,
        error_note: "Incorrect parameter amount",
      });
      next();
    }

    if (payment["status"] === PaymentStatus.REJECTED) {
      Object.assign(req, {
        error: -9,
        error_note: "Transaction cancelled",
      });
      next();
    }

    Object.assign(req, {
      error: 0,
      error_note: "Success",
    });
    next();
  } catch (error) {
    return next(new ClickError('Incorrect request', ClickError.ERROR_METHOD_NOT_FOUND));
  }
};
