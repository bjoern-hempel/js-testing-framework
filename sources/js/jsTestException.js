
/**
 * Own js test exception class.
 *
 * @author  Björn Hempel <bjoern@hempel.li>
 * @version 1.0 (2018-06-06)
 */
class JsTestException {

    /**
     * The class constructor.
     *
     * @param type
     */
    constructor(code, message) {
        this.code = code;
        this.message = message;

        this.name = 'JsTestException';
    }

    /**
     * toString method to create a nice readable message.
     *
     * @returns {string}
     */
    toString() {
        return this.name + ': "' + this.message + '"';
    }
}
