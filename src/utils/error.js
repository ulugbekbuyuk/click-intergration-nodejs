class ClickError extends Error {
  static get ERROR_INTERNAL_SYSTEM() {
    return -32400;
  }
  static get ERROR_INSUFFICIENT_PRIVILEGE() {
    -32504;
  }
  static get ERROR_INVALID_JSON_RPC_OBJECT() {
    -32600;
  }
  static get ERROR_METHOD_NOT_FOUND() {
    -32601;
  }
  static get ERROR_INVALID_AMOUNT() {
    -31001;
  }
  static get ERROR_TRANSACTION_NOT_FOUND() {
    -31003;
  }
  static get ERROR_INVALID_ACCOUNT() {
    -31050;
  }
  static get ERROR_COULD_NOT_CANCEL() {
    -31007;
  }
  static get ERROR_COULD_NOT_PERFORM() {
    -31008;
  }

  constructor(error_note, error_code) {
    super();
    this.error_note = error_note;
    this.error_code = error_code;
  }
}

const errorHandler = (err, req, res, next) => {
  // 
  res.json({
    error_note: err['error_note'],
    error: err['error_code']
  });
}

module.exports = { ClickError, errorHandler };
