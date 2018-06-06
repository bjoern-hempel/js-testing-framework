
/**
 * Own js test exception.
 *
 * @author  Björn Hempel <bjoern@hempel.li>
 * @version 1.0 (2018-06-06)
 */
function JsTestException(code, message) {
    this.code = code;
    this.message = message;

    this.name = 'JsTestException';
}

/**
 * toString method to create a nice readable message.
 *
 * @returns {string}
 */
JsTestException.prototype.toString = function () {
    return this.name + ': "' + this.message + '"';
};