"use strict";

var useBrowserStack = Boolean(process.env.BROWSERSTACK_KEY) && process.env.TRAVIS_SECURE_ENV_VARS === "true";

var vendorJavascripts = [
    "./bower_components/json3/lib/json3.js",
    "./bower_components/lodash/dist/lodash.compat.js",
    "./bower_components/es6-promise/promise.js",
    "./bower_components/uri.js/src/URI.js",
];

module.exports = function (config) {
    config.set({
        basePath: "../..",
        frameworks: ["mocha", "expect", "sinon", "bdd-using"],
        reporters: ["mocha", "coverage"],
        browserNoActivityTimeout: 30000,

        files: [].concat(
            vendorJavascripts,
            "./.tmp/http.js",
            "./.tmp/test/**/*Spec.js"
        ),


        browserStack: {
            username: process.env.BROWSERSTACK_USER,
            accessKey: process.env.BROWSERSTACK_KEY,
        },

        coverageReporter: {
            type: "lcov",
            dir: "coverage/",
        },

        customLaunchers: require("./custom-launchers.conf.json"),

        browsers: useBrowserStack ? [
            "bs_firefox_mac",
            "bs_opera_mac",
            "bs_chrome_mac",
            "bs_ie_8",
            "bs_ie_9",
            "bs_ie_10",
            "bs_ie_11",
        ] : ["PhantomJS"],
    });
};
