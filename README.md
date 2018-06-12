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

## 1. Usage

### 1.1 Basi

```javascript
var tests = function () {

    /* simple success test */
    new JsSuccessTest(
        'check 1 + 2',
        function () {
            var sum = 1 + 2;

            return JsTest.equalInteger(sum, 3);
        }
    );

    /* simple Error test */
    new JsErrorTest(
        'check 1 + 2',
        100,
        function () {
            var sum = 1 + 2;

            throw new Error('100 - Simple Error test');

            return JsTest.equalInteger(sum, 3);
        }
    );

    /* simple error test */
    new JsErrorTest(
        'check 1 + 2',
        new JsTestException(100),
        function () {
            var sum = 1 + 2;

            throw new JsTestException(100, 'Simple JsTestException test');

            return JsTest.equalInteger(sum, 3);
        }
    );
}

JsTest.startTests('Simple tests.', tests);
```

## A. Authors

* Björn Hempel <bjoern@hempel.li> - _Initial work_ - [https://github.com/bjoern-hempel](https://github.com/bjoern-hempel)

## B. Licence

This tutorial is licensed under the MIT License - see the [LICENSE.md](/LICENSE.md) file for details
