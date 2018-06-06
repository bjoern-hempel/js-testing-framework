/**
 * A class to test the matrix class.
 *
 * @author  Björn Hempel <bjoern@hempel.li>
 * @version 1.0 (2018-05-13)
 */
class JsTest {

    /**
     * The constructor of JsTest.
     *
     * @param message
     * @param code
     * @param testFunction
     * @param errorFunction
     */
    constructor(messageCode, testFunction, errorFunction) {
        this.mode = null;

        if (!(messageCode instanceof Array)) {
            this.mode = messageCode.mode;
            messageCode = messageCode.config;
        }

        this.message = messageCode[2];
        this.code = messageCode[1];
        this.originClass = messageCode[0];
        this.testFunction = testFunction;
        this.errorFunction = typeof errorFunction === 'function' ? errorFunction : this.errFunc;
        this.testOK = false;

        /* start the test */
        this.start();
    }

    /**
     * This is the default error function if no one given.
     *
     * @param err
     * @returns {boolean}
     */
    errFunc(err) {
        /* This is a success test -> an exception should never be thrown. */
        if (this.code >= 200) {
            return false;
        }

        return (err instanceof JsTestException) && (err.code === this.code);
    }

    /**
     * The function to start the test.
     */
    start() {
        this.constructor.increaseCounter();

        this.log(
            String('%counter) %class: Running %status test "%message" %add(Code: %code).').
                replace(/%class/, this.originClass.CLASS_NAME).
                replace(/%counter/, String(JsTest.getCounter()).padStart(3)).
                replace(/%status/, this.code >= 200 ? 'success' : 'error').
                replace(/%message/, this.message).replace(/%code/, this.code).
                replace(/%add/, this.mode !== null ? '[mode: ' + this.mode + '] ' : '')
        );

        /* reset counters */
        this.constructor.equalObjectInstanceCounter = 0;
        this.constructor.equalIntegerCounter = 0;
        this.constructor.equalNumberCounter = 0;
        this.constructor.equalArrayValuesCounter = 0;
        this.constructor.equalArrayLengthCounter = 0;

        var timeStart = performance.now();
        try {
            this.testOK = this.testFunction.call(this);
        } catch (err) {
            this.testOK = this.errorFunction.call(this, err);
            if (!this.testOK) {
                console.error(err.toString());
            }
        }
        var timeFinished = performance.now();

        var timeNeeded = Math.round((timeFinished - timeStart) * 100000) / 100000;

        var message = this.testOK ? 'Test succeeded (%time).' : 'Test failed (%time).';

        message = '     ' + message.replace('%time', timeNeeded + ' ms');

        this.testOK ? this.log(message, 'info') : this.log(message, 'error');

        if (!this.testOK) {
            this.constructor.increaseErrorCounter();
        } else {
            this.constructor.increaseSuccessCounter();
        }
    }

    /**
     * Logs a log value to console.
     *
     * @param logValue
     * @param type
     */
    log(logValue, type) {
        this.constructor.log(logValue, type);
    }

    /**
     * Increases the test counter.
     */
    static increaseCounter() {
        if (typeof this.counter === 'undefined') {
            this.counter = 0;
        }

        this.counter++;
    }

    /**
     * Increases the test counter.
     */
    static increaseSuccessCounter() {
        if (typeof this.successCounter === 'undefined') {
            this.successCounter = 0;
        }

        this.successCounter++;
    }

    /**
     * Increases the error counter.
     */
    static increaseErrorCounter() {
        if (typeof this.errorCounter === 'undefined') {
            this.errorCounter = 0;
        }

        this.errorCounter++;
    }

    /**
     * Returns the number of tests.
     *
     * @returns {number}
     */
    static getCounter() {
        return typeof this.counter === 'undefined' ? 0 : this.counter;
    }

    /**
     * Returns the number of tests.
     *
     * @returns {number}
     */
    static getSuccessCounter() {
        return typeof this.successCounter === 'undefined' ? 0 : this.successCounter;
    }

    /**
     * Returns the number of errors.
     *
     * @returns {number}
     */
    static getErrorCounter() {
        return typeof this.errorCounter === 'undefined' ? 0 : this.errorCounter;
    }

    /**
     * Returns the number of all tests.
     *
     * @returns {number}
     */
    static getAllCounter() {
        return this.getSuccessCounter() + this.getErrorCounter();
    }

    /**
     * Start the tests and measure the time.
     */
    static startTests() {
        var title = 'Tests';

        if (typeof arguments[0] === 'string') {
            var title = Array.prototype.shift.apply(arguments);
        }

        var message = String('Start test "%title"').replace(/%title/, title);

        this.log('-'.repeat(message.length));
        this.log(message);
        this.log('-'.repeat(message.length));
        this.log('');

        this.timeStart = performance.now();

        [].slice.call(arguments).map(function (argument) {
            if (typeof argument === 'function') {
                argument();
            }
        });

        this.resultTests();
    }

    /**
     * A static method to prints out the result of all tests.
     *
     */
    static resultTests() {
        this.timeFinished = performance.now();

        var timeNeeded = Math.round((this.timeFinished - this.timeStart) * 100000) / 100000;

        var message = JsTest.getErrorCounter() <= 0 ?
            '-> All test succeeded (%time) [success: %testsSuccess; error: %testsError; all: %testsAll].' :
            '-> At least on test failed (%time) [%testsError/%testsAll]';

        message = message.
            replace('%time', timeNeeded + ' ms').
            replace('%testsSuccess', this.getSuccessCounter()).
            replace('%testsError', this.getErrorCounter()).
            replace('%testsAll', this.getAllCounter());

        this.log('');
        this.log('-'.repeat(message.length));
        this.log('RESULT');
        JsTest.getErrorCounter() <= 0 ? this.log(message, 'info') : this.log(message, 'error');
        this.log('-'.repeat(message.length));
    }

    /**
     * Checks if the given object is an instance of given instance.
     *
     * @param obj
     * @param instance
     * @param {String=} message (optional)
     * @returns {boolean}
     */
    static equalObjectInstance(obj, instance, message) {
        var counter = message ? 0 : ++this.equalObjectInstanceCounter;
        var message = message ? message : String('     The %counter. equalObjectInstance test failed.').replace(/%counter/, counter)

        if (!(obj instanceof instance)) {
            this.log(message, 'error');
            return false;
        }

        return true;
    }

    /**
     * Compares two given integers.
     *
     * @param {Integer} integer1
     * @param {Integer} integer2
     * @param {String=} message (optional)
     * @returns {boolean}
     */
    static equalInteger(integer1, integer2, message) {
        var counter = message ? 0 : ++this.equalIntegerCounter;
        var message = message ? message : String('     The %counter. equalInteger test failed.').replace(/%counter/, counter);

        if (!Number.isInteger(integer1)) {
            this.log(message, 'error');
            return false;
        }

        if (!Number.isInteger(integer2)) {
            this.log(message, 'error');
            return false;
        }

        if (integer1 !== integer2) {
            this.log(message, 'error');
            return false;
        }

        return true;
    }

    /**
     * Compares two given integers.
     *
     * @param {Integer} integer1
     * @param {Integer} integer2
     * @param {String=} message (optional)
     * @returns {boolean}
     */
    static equalNumber(number1, number2, digits, message) {
        var counter = message ? 0 : ++this.equalNumberCounter;
        var message = message ? message : String('     The %counter. equalNumber test failed.').replace(/%counter/, counter);

        if (!this.isNumber(number1)) {
            this.log(message, 'error');
            return false;
        }

        if (!this.isNumber(number2)) {
            this.log(message, 'error');
            return false;
        }

        var potency = Math.pow(10, digits);

        if (Math.round(number1 * potency) !== Math.round(number2 * potency)) {
            this.log(message, 'error');
            return false;
        }

        return true;
    }

    /**
     * Compares two given arrays.
     *
     * @param {Array} array1
     * @param {Array} array2
     * @param {String=} message (optional)
     * @returns {boolean}
     */
    static equalArrayValues(array1, array2, message) {
        var counter = message ? 0 : ++this.equalArrayValuesCounter;
        var message = message ? message : String('     The %counter. equalArrayValues test failed.').replace(/%counter/, counter);

        if (!(array1 instanceof Array)) {
            this.log(message, 'error');
            return false;
        }

        if (!(array2 instanceof Array)) {
            this.log(message, 'error');
            return false;
        }

        if (array1.length != array2.length) {
            this.log(message, 'error');
            return false;
        }

        for (var i = 0; i < array1.length; i++) {
            if (array1[i] instanceof Array && array2[i] instanceof Array) {
                if (!this.equalArrayValues(array1[i], array2[i], message)) {
                    this.log(message, 'error');
                    return false;
                }
            } else if (array1[i] != array2[i]) {
                this.log(message, 'error');
                return false;
            }
        }

        return true;
    }

    /**
     * Check the array length.
     *
     * @param {Array} array
     * @param {Integer} size
     * @param {String=} message (optional)
     * @returns {boolean}
     */
    static equalArrayLength(array, size, message) {
        var counter = message ? 0 : ++this.equalArrayLengthCounter;
        var message = message ? message : String('     The %counter. equalArrayLength test failed.').replace(/%counter/, counter);

        if (!this.equalObjectInstance(array, Array, message)) {
            this.log(message, 'error');
            return false;
        }

        if (!Number.isInteger(size)) {
            this.log(message, 'error');
            return false;
        }

        if (array.length !== size) {
            this.log(message, 'error');
            return false;
        }

        return true;
    }

    /**
     * Check, if given value is a number.
     *
     * @param value
     * @returns {boolean}
     */
    static isNumber(value) {
        if (Number(value) === value && value % 1 === 0) {
            return true;
        }

        if (Number(value) === value && value % 1 !== 0) {
            return true;
        }

        return false;
    }

    /**
     * Logs a log value to console.
     *
     * @param logValue
     */
    static log(logValue, type) {
        switch (type) {
            case 'info':
                this.doLog(console.info, logValue, '');
                return;

            case 'warn':
                this.doLog(console.warn, logValue, '');
                return;

            case 'error':
                this.doLog(console.error, logValue, 'color: red; ');
                return;

            default:
                this.doLog(console.log, logValue, '');
                return;
        }
    }

    /**
     * Logs a log value to console.
     *
     * @param consoleType
     * @param logValue
     * @param style
     */
    static doLog(consoleType, logValue, style) {
        style = style + 'font-size: 10px; font-style: italic; margin: 0;';

        setTimeout(consoleType.bind(console, '%c' + logValue, style));

        if (document.getElementById('testResult') === null) {
            var div = document.createElement('div');
            div.setAttribute('id', 'testResult');

            document.body.appendChild(div);
        }

        var pre = document.createElement('pre');

        pre.setAttribute('style', style);
        pre.innerHTML = logValue ? logValue : ' ';

        document.getElementById('testResult').appendChild(pre);
    }
}