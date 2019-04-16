process.env.NODE_PATH = __dirname;
require("module")._initPaths();

const Jasmine = require("jasmine");

const jasmine = new Jasmine();

jasmine.loadConfigFile("spec/support/jasmine.json");


const ANSI_COLOR = {
    green: '\x1B[32m',
    red: '\x1B[31m',
    cyan: '\x1B[36m',
    none: '\x1B[0m'
};

function log(str) {
    console.log(str);
}

function logTitle(str) {
    console.log(ANSI_COLOR.cyan + str + ANSI_COLOR.none);
}

function logSuccess(str) {
    console.log(ANSI_COLOR.green + str + ANSI_COLOR.none);
}

function logFailure(str) {
    console.log(ANSI_COLOR.red + str + ANSI_COLOR.none);
}

function repeat(thing, times) {
    var arr = [];
    for (var i = 0; i < times; i++) {
        arr.push(thing);
    }
    return arr;
}

function indent(str, spaces) {
    var lines = (str || '').split('\n');
    var newArr = [];
    for (var i = 0; i < lines.length; i++) {
        newArr.push(repeat(' ', spaces).join('') + lines[i]);
    }
    return newArr.join('\n');
}

/**
 * To create a custom reporter, just define an object with functions exposed by jasmine
 * {@link https://jasmine.github.io/api/edge/Reporter.html|reporter interface.}
 * None of these functions are mandatory when creating a custom reporter, any that are not provided
 * will be just ignored by jasmine.
 */
const customReporter = {
    failedSpecs: [],

    jasmineStarted(testInfo) {
        logTitle(`Running ${testInfo.totalSpecsDefined} specs`);
    },
    suiteStarted(suiteInfo) {
        logTitle(`Running suite ${suiteInfo.fullName}`);
    },
    specStarted(specInfo) {
    },
    specDone(specResult) {
        if (specResult.status === "passed") {
            logSuccess(`  Pass: ${specResult.description}`);
        } else {
            logFailure(`  Fail: ${specResult.description}`);
            this.failedSpecs.push(specResult);
        }
    },
    suiteDone(suiteResult) {
    },
    jasmineDone(testResult) {
        if (this.failedSpecs.length) {
            logTitle("\n\nFailures:");
            this.failedSpecs.forEach(specResult => {
                logFailure(`${specResult.fullName}`);
                specResult.failedExpectations.forEach(e => {
                    log("  Message:");
                    logFailure(`    ${e.message}`);
                    log("  Stack:");
                    log(indent(e.stack.toString(), 4));
                });
            });
        }
    }
};

// remove default reporters (jsApiReporter is added by default)
jasmine.env.clearReporters();
// add custom reporter
jasmine.env.addReporter(customReporter);

jasmine.execute();
