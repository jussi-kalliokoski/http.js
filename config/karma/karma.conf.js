"use strict";

var useBrowserStack = Boolean(process.env.BROWSERSTACK_KEY) && process.env.TRAVIS_SECURE_ENV_VARS === "true";

module.exports = function (config) {
    config.set({
        basePath: "../..",
        frameworks: ["mocha", "chai", "sinon-chai", "chai-as-promised", "bdd-using"],
        reporters: ["mocha", "coverage"],

        browserStack: {
            username: process.env.BROWSERSTACK_USER,
            accessKey: process.env.BROWSERSTACK_KEY
        },

        coverageReporter: {
            type: "lcov",
            dir: "coverage/"
        },

        preprocessors: {
            "src/**/*.js": ["coverage"]
        },

        customLaunchers: {
            bs_firefox_mac: {
                base: "BrowserStack",
                browser: "firefox",
                browser_version: "latest",
                os: "OS X",
                os_version: "Mountain Lion"
            },

            bs_opera_mac: {
                base: "BrowserStack",
                browser: "opera",
                browser_version: "latest",
                os: "OS X",
                os_version: "Mavericks"
            },

            bs_chrome_mac: {
                base: "BrowserStack",
                browser: "chrome",
                browser_version: "latest",
                os: "OS X",
                os_version: "Mavericks"
            },

            bs_ie_10: {
                base: "BrowserStack",
                browser: "ie",
                browser_version: "10.0",
                os: "Windows",
                os_version: "7"
            },

            bs_ie_11: {
                base: "BrowserStack",
                browser: "ie",
                browser_version: "11.0",
                os: "Windows",
                os_version: "8.1"
            }
        },

        browsers: useBrowserStack ? [
            "bs_firefox_mac",
            "bs_opera_mac",
            "bs_chrome_mac",
            "bs_ie_10",
            "bs_ie_11"
        ] : ["PhantomJS"]
    });
};
