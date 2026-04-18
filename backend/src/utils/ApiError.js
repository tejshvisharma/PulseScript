export default class ApiError extends Error {
  constructor(statuscode, message, errors = [], stack = "") {
    super(message);
    this.statuscode = statuscode;
    this.message = message;
    this.success = false;
    this.errors = errors;

    if (stack) this.stack = stack;
    else Error.captureStackTrace(this, this.constructor);
  }
}
