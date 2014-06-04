"use strict";

module.exports = function (config) {
  config.set({
    basePath: "../..",
    frameworks: ["mocha", "chai", "sinon-chai", "chai-as-promised", "bdd-using"],
    browsers: ["PhantomJS"],
    reporters: ["mocha", "coverage"],

    coverageReporter: {
      type: "lcov",
      dir: "coverage/"
    },

    preprocessors: {
      "src/**/*.js": ["coverage"]
    }
  });
};
