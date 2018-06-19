# A Javascript testing framework

This is a small testing framework to make test driven development and unit testing easy.

## 0. Introduction

### 0.1 Add this library as git submodule

```bash
user$ cd /your/root/project/path
user$ git submodule add https://github.com/bjoern-hempel/js-testing-framework.git vendor/js-testing-framework
user$ git commit -m "add the js-testing-framework library as submodule" .gitmodules vendor/js-testing-framework
user$ git push
```

### 0.2 Update submodule to the latest master version

```bash
user$ cd /your/root/project/path
user$ cd vendor/js-testing-framework
user$ git pull origin master
user$ cd ../..
user$ git add vendor/js-testing-framework
user$ git commit -m "update the js-testing-framework library submodule" vendor/js-testing-framework
user$ git push
```

## 1. Usage - Basic Examples

### 1.1 Basic Test Example

```javascript
var test = new JsSuccessTest([
    'check 1 + 2',
    new JsTestTestFunction(function () {
        var sum = 1 + 2;
        return JsTest.equalInteger(sum, 3);
    })
]);

JsTest.startTests('Simple tests.', test);
```

The test returns:

```javascript
──────────────────────────
Start test "Simple tests."
──────────────────────────
 
  1) Running success test "check 1 + 2" .
     → Test succeeded (0.1 ms).
 
──────────────────────────────────────────────────────────────
RESULT
-> All test succeeded (0.7 ms) [success: 1; error: 0; all: 1].
──────────────────────────────────────────────────────────────
```

### 1.2 Multiple Test Example

```javascript
var tests = [
    new JsSuccessTest(
        'check 1 + 2',
        new JsTestTestFunction(function () {
            var sum = 1 + 2;
            return JsTest.equalInteger(sum, 3);
        })
    ),
    new JsSuccessTest(
        'check 10 - 2',
        new JsTestTestFunction(function () {
            var difference = 10 - 2;
            return JsTest.equalInteger(difference, 8);
        })
    )
];

JsTest.startTests('Simple tests.', tests);
```

The test returns:

```javascript
──────────────────────────
Start test "Simple tests."
──────────────────────────
 
  1) Running success test "check 1 + 2" .
     → Test succeeded (0.1 ms).
  2) Running success test "check 10 - 2" .
     → Test succeeded (0.1 ms).
 
────────────────────────────────────────────────────────────
RESULT
-> All test succeeded (1 ms) [success: 2; error: 0; all: 2].
────────────────────────────────────────────────────────────
```

### 1.3 Error Test Example

Use the error test (JsErrorTest) if you expect an exception as a test result:

```javascript
var test = new JsErrorTest(
    'check 1 + 2',
    100,
    new JsTestTestFunction(function () {
        var sum = 1 + 2;
        throw new Error('100 - Simple Error test');
        return JsTest.equalInteger(sum, 3);
    })
);

JsTest.startTests('Simple error test.', test);
```

The test returns

```javascript
───────────────────────────────
Start test "Simple error test."
───────────────────────────────
 
  1) Running error test "check 1 + 2" (Code: 100).
     → Test succeeded (6 ms).
 
──────────────────────────────────────────────────────────────
RESULT
-> All test succeeded (6.8 ms) [success: 1; error: 0; all: 1].
──────────────────────────────────────────────────────────────
```

### 1.4 Summary of all tests within a function

Use a function to summerize all tests within a function instead of a JsTest Array. Within this function you must mark each test with the JsTestAutostart class, to start the test immediately:

```javascript
var tests = function() {
    new JsSuccessTest(
        'check 1 + 2',
        new JsTestTestFunction(function () {
            var sum = 1 + 2;
            return JsTest.equalInteger(sum, 3);
        }),
        new JsTestAutostart(this)
    );

    new JsSuccessTest(
        'check 10 - 2',
        new JsTestTestFunction(function () {
            var difference = 10 - 2;
            return JsTest.equalInteger(difference, 8);
        }),
        new JsTestAutostart(this)
    );
};

JsTest.startTests('Simple tests.', tests);
```

The test returns:

```javascript
──────────────────────────
Start test "Simple tests."
──────────────────────────
 
  1) Running success test "check 1 + 2" .
     → Test succeeded (0.1 ms).
  2) Running success test "check 10 - 2" .
     → Test succeeded (0.1 ms).
 
──────────────────────────────────────────────────────────────
RESULT
-> All test succeeded (3.1 ms) [success: 2; error: 0; all: 2].
──────────────────────────────────────────────────────────────
```

## A. Authors

* Björn Hempel <bjoern@hempel.li> - _Initial work_ - [https://github.com/bjoern-hempel](https://github.com/bjoern-hempel)

## B. Licence

This tutorial is licensed under the MIT License - see the [LICENSE.md](/LICENSE.md) file for details
