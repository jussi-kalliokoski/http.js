"use strict";

module.exports = function (config) {
  config.set({
    basePath: "../..",
    frameworks: ["mocha", "chai", "sinon-chai", "chai-as-promised"],
    browsers: ["PhantomJS"],
    reporters: ["mocha", "coverage"],

    coverageReporter: {
      type: "html",
      dir: "coverage/"
    },

    preprocessors: {
      "src/**/*.js": ["coverage"]
    }
  });
};
