/**
 * Static variable container for the class JsTest
 */
let staticContainerJsTest = {
    autostart: false,
    equalObjectInstanceCounter: 0,
    equalIntegerCounter: 0,
    equalNumberCounter: 0,
    equalArrayValuesCounter: 0,
    equalArrayLengthCounter: 0,
    options: {
        outputConsole:     true,
        outputDocument:    true,
        outputId:          'testResult',
        outputEntryStyle:  {
            fontSize: '10px',
            fontStyle: 'italic',
            margin: 0
        },
        outputSectionStyle: null
    }
}

/**
 * The js test class.
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
    constructor() {
        this.message = 'js-testing-framework test';
        this.mode = null;
        this.code = null;
        this.type = '';
        this.originClass = null;
        this.testOK = false;
        this.errorClass = Error;
        this.testMessage = null;

        [].forEach.call(arguments, function (argument) {
            this.doArgument(argument);
        }, this);

        /* start the test */
        if (staticContainerJsTest.autostart) {
            this.start();
        }
    }

    /**
     * Assume the given argument List
     *
     * @param argumentList
     */
    doArgument(argument) {
        switch (true) {
            /* Array given -> analyse the array with the following types */
            case argument instanceof Array:
                [].forEach.call(argument, function(arg) {
                    this.doArgument(arg);
                }, this);
                break;

            /* error/success type given */
            case argument instanceof JsTestType:
                this.type = String(argument);
                break;

            /* mode given */
            case argument instanceof JsTestMode:
                this.mode = String(argument);
                break;

            /* JsTestException given */
            case argument instanceof JsTestException:
                this.errorClass = JsTestException;
                this.code = argument.code;

                if (argument.message) {
                    this.message = argument.message;
                }
                break;

            /* test function given */
            case argument instanceof JsTestTestFunction:
                this.testFunction = argument.testFunction;
                break;

            /* error function given */
            case argument instanceof JsTestErrorFunction:
                this.errorFunction = argument.errorFunction;
                break;

            /* object (class) given */
            case typeof argument === 'object':
                if (argument.constructor.name.match(/Exception/)) {
                    this.errorClass = eval(argument.constructor.name);
                    this.code = argument.code;

                    if (argument.message) {
                        this.message = argument.message;
                    }

                    break;
                }

                this.originClass = argument;
                break;

            /* string given */
            case typeof argument === 'string':
                this.message = argument;
                break;

            /* number given */
            case typeof argument === 'number':
                this.code = parseInt(argument);
                break;

            /* origin class given */
            case typeof argument === 'function':
                this.originClass = argument;
                break;

            default:
                console.log(typeof argument);
        }
    }

    /**
     * This is the default error function if no one given.
     *
     * @param error
     * @returns {boolean}
     */
    errorFunction(error) {
        if (this.code) {
            var code = 'code' in error ? error.code : parseInt(error.message);

            if (!(error instanceof this.errorClass)) {
                this.testMessage = 'Different error exception class';
                return false;
            }

            if (this.code !== code) {
                this.testMessage = String('The error code is not the expected one (thrown: %codeThrown; expected: %codeExpected).').
                    replace('%codeThrown', code).
                    replace('%codeExpected', this.code);
                return false;
            }

            this.testMessage = error.message ? error.message : 'The thrown exception is the expected one.';
            return true;
        } else {
            if (!(error instanceof this.errorClass)) {
                this.testMessage = 'Different error exception class';
                return false;
            }

            this.testMessage = error.message ? error.message : 'The thrown exception is the expected one.';
            return true;
        }
    }

    /**
     * This is the default error function if no one given.
     *
     * @param err
     * @returns {boolean}
     */
    testFunction(success) {
        return false;
    }

    /**
     * The function to start the test.
     */
    start() {
        this.constructor.increaseCounter();

        /* build class name */
        var className = '';
        if (this.originClass) {
            className = ('name' in this.originClass ? this.originClass.name : this.originClass.constructor.name) + ': ';
        }

        this.log(
            String('%counter) %classRunning %statustest "%message" %mode%code.').
                replace(/%counter/, String(JsTest.getCounter()).padStart(3)).
                replace(/%class/,   className).
                replace(/%status/,  this.type          ? this.type + ' '                    : '').
                replace(/%message/, this.message).
                replace(/%mode/,    this.mode !== null ? '[mode: ' + this.mode + '] '       : '').
                replace(/%code/,    this.code          ? '(Code: ' + this.code + ')'        : ''),
            'info'
        );

        /* reset counters */
        staticContainerJsTest.equalObjectInstanceCounter = 0;
        staticContainerJsTest.equalIntegerCounter = 0;
        staticContainerJsTest.equalNumberCounter = 0;
        staticContainerJsTest.equalArrayValuesCounter = 0;
        staticContainerJsTest.equalArrayLengthCounter = 0;

        var timeStart = performance.now();
        try {
            this.testOK = this.testFunction.call(this);
        } catch (error) {
            this.testOK = this.errorFunction.call(this, error);
        }
        var timeFinished = performance.now();

        var timeNeeded = Math.round((timeFinished - timeStart) * 100000) / 100000;

        var message = this.testOK ? 'Test succeeded%message (%time).' : 'Test failed%message (%time).';

        message = '     → ' + message.replace('%message', this.testMessage ? ': "' + this.testMessage + '"' : '').replace('%time', timeNeeded + ' ms');

        this.testOK ? this.log(message, 'success') : this.log(message, 'error');

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
     * Convert given object to string.
     *
     * @param object
     * @returns {*|string}
     */
    static convertObjectToString(object) {
        var string = '';

        switch (true) {
            case typeof object === 'object':
                for (var name in object) {
                    string += name.replace(/([A-Z])/, '-$1').toLowerCase() + ': ' + object[name] + '; ';
                }
                break;

            case typeof object === 'string':
                string = object;
                break;

            default:
                string = '';
                break;
        }

        return string;
    }

    /**
     * Set test options.
     *
     * @param options
     */
    static setOptions(options) {
        for (var name in options) {
            staticContainerJsTest.options[name] = options[name];
        }
    }

    /**
     * Increases the test counter.
     */
    static increaseCounter() {
        if (typeof staticContainerJsTest.counter === 'undefined') {
            staticContainerJsTest.counter = 0;
        }

        staticContainerJsTest.counter++;
    }

    /**
     * Increases the test counter.
     */
    static increaseSuccessCounter() {
        if (typeof staticContainerJsTest.successCounter === 'undefined') {
            staticContainerJsTest.successCounter = 0;
        }

        staticContainerJsTest.successCounter++;
    }

    /**
     * Increases the error counter.
     */
    static increaseErrorCounter() {
        if (typeof staticContainerJsTest.errorCounter === 'undefined') {
            staticContainerJsTest.errorCounter = 0;
        }

        staticContainerJsTest.errorCounter++;
    }

    /**
     * Returns the number of tests.
     *
     * @returns {number}
     */
    static getCounter() {
        return typeof staticContainerJsTest.counter === 'undefined' ? 0 : staticContainerJsTest.counter;
    }

    /**
     * Returns the number of tests.
     *
     * @returns {number}
     */
    static getSuccessCounter() {
        return typeof staticContainerJsTest.successCounter === 'undefined' ? 0 : staticContainerJsTest.successCounter;
    }

    /**
     * Returns the number of errors.
     *
     * @returns {number}
     */
    static getErrorCounter() {
        return typeof staticContainerJsTest.errorCounter === 'undefined' ? 0 : staticContainerJsTest.errorCounter;
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

        this.log('─'.repeat(message.length));
        this.log(message);
        this.log('─'.repeat(message.length));
        this.log('');

        this.timeStart = performance.now();
        this.doTests.apply(this, arguments);
        this.resultTests();
    }

    /**
     * Execute all tests.
     */
    static doTests() {
        [].slice.call(arguments).map(function (argument) {
            staticContainerJsTest.autostart = false;
            switch (true) {
                case argument instanceof Array:
                    this.doTests.apply(this, argument);
                    break;

                case argument instanceof JsTest:
                    argument.start(this);
                    break;

                case typeof argument === 'function':
                    staticContainerJsTest.autostart = true;
                    argument();
                    break;

                default:
                    throw new Error('JsTest.doTests: Unknown argument type.');
                    break;
            }
        }, this);
        staticContainerJsTest.autostart = false;
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
        this.log('─'.repeat(message.length));
        this.log('RESULT');
        JsTest.getErrorCounter() <= 0 ? this.log(message, 'info') : this.log(message, 'error');
        this.log('─'.repeat(message.length));
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
        var counter = message ? 0 : ++staticContainerJsTest.equalObjectInstanceCounter;
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
        var counter = message ? 0 : ++staticContainerJsTest.equalIntegerCounter;
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
        var counter = message ? 0 : ++staticContainerJsTest.equalNumberCounter;
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
        var counter = message ? 0 : ++staticContainerJsTest.equalArrayValuesCounter;
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
        var counter = message ? 0 : ++staticContainerJsTest.equalArrayLengthCounter;
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
            case 'success':
                this.doLog(console.log, logValue, 'color: green; font-weight: bold; ');
                return;

            case 'warn':
                this.doLog(console.log, logValue, 'color: orange; font-weight: bold; ');
                return;

            case 'error':
                this.doLog(console.log, logValue, 'color: red; font-weight: bold; ');
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

        style = style + this.convertObjectToString(staticContainerJsTest.options.outputEntryStyle);

        if (staticContainerJsTest.options.outputConsole) {
            setTimeout(consoleType.bind(console, '%c' + logValue, style));
        }

        if (staticContainerJsTest.options.outputDocument) {
            if (document.getElementById(staticContainerJsTest.options.outputId) === null) {
                var div = document.createElement('div');
                div.setAttribute('id', staticContainerJsTest.options.outputId);

                document.body.appendChild(div);
            }

            if (staticContainerJsTest.options.outputSectionStyle) {
                document.getElementById(staticContainerJsTest.options.outputId).setAttribute(
                    'style',
                    this.convertObjectToString(staticContainerJsTest.options.outputSectionStyle)
                );
            }

            var pre = document.createElement('pre');

            pre.setAttribute('style', style);
            pre.innerHTML = logValue ? logValue : ' ';

            document.getElementById(staticContainerJsTest.options.outputId).appendChild(pre);
        }
    }
}

/**
 * The js success test class.
 *
 * @author  Björn Hempel <bjoern@hempel.li>
 * @version 1.0 (2018-06-11)
 */
class JsSuccessTest extends JsTest {

    /**
     * The constructor of JsSuccessTest.
     *
     * @param message
     * @param code
     * @param testFunction
     * @param errorFunction
     */
    constructor() {
        super(
            new JsTestType(JsTestType.SUCCESS),
            ...arguments
        );
    }
}

/**
 * The js error test class.
 *
 * @author  Björn Hempel <bjoern@hempel.li>
 * @version 1.0 (2018-06-11)
 */
class JsErrorTest extends JsTest {

    /**
     * The constructor of JsErrorTest.
     *
     * @param message
     * @param code
     * @param testFunction
     * @param errorFunction
     */
    constructor() {
        super(
            new JsTestType(JsTestType.ERROR),
            ...arguments
        );
    }
}

/**
 * The js test type class.
 *
 * @author  Björn Hempel <bjoern@hempel.li>
 * @version 1.0 (2018-06-08)
 */
class JsTestType {

    static get SUCCESS() {
        return 'success';
    }

    static get ERROR() {
        return 'error';
    }

    /**
     * The class constructor.
     *
     * @param type
     */
    constructor(type) {
        this.type = type === 'error' ? 'error' : 'success';
    }

    /**
     * To string function.
     *
     * @returns {string|*}
     */
    toString() {
        return this.type;
    }
}

/**
 * The js test mode class.
 *
 * @author  Björn Hempel <bjoern@hempel.li>
 * @version 1.0 (2018-06-08)
 */
class JsTestMode {

    /**
     * The class constructor.
     *
     * @param mode
     */
    constructor(mode) {
        this.mode = mode;
    }

    /**
     * To string function.
     *
     * @returns {string|*}
     */
    toString() {
        return this.mode;
    }
}

/**
 * The js test test function class.
 *
 * @author  Björn Hempel <bjoern@hempel.li>
 * @version 1.0 (2018-06-08)
 */
class JsTestTestFunction {

    /**
     * The class constructor.
     *
     * @param mode
     */
    constructor(testFunction) {
        this.testFunction = testFunction;
    }
}

/**
 * The js test error function class.
 *
 * @author  Björn Hempel <bjoern@hempel.li>
 * @version 1.0 (2018-06-08)
 */
class JsTestErrorFunction {

    /**
     * The class constructor.
     *
     * @param mode
     */
    constructor(errorFunction) {
        this.errorFunction = errorFunction;
    }
}
