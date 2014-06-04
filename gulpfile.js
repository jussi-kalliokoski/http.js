"use strict";

var gulp = require("gulp");
var jshint = require("gulp-jshint");
var jscs = require("gulp-jscs");
var karma = require("gulp-karma");
var concat = require("gulp-concat");

var vendorJavascripts = [
    "./bower_components/lodash/dist/lodash.js",
    "./bower_components/es6-promise/promise.js",
    "./bower_components/uri.js/src/URI.js"
];

var sources = [
    "./src/index.js",
    "./src/Errors/*.js",
    "./src/Request.js",
    "./src/RequestSugar.js",
    "./src/RequestUrlHelpers.js",
    "./src/MethodShorthands.js",
    "./src/RequestTypeHandlers/*.js",
    "./src/ResponseTypeHandlers/*.js"
];

gulp.task("jshint", function () {
    return gulp.src(sources)
        .pipe(jshint())
        .pipe(jshint.reporter("default"));
});

gulp.task("jscs", function () {
    return gulp.src(sources)
        .pipe(jscs("./.jscs.json"));
});

gulp.task("karma", function () {
    return gulp.src(vendorJavascripts.concat(sources, "./test/**/*Spec.js"))
        .pipe(karma({
            configFile: "./config/karma/karma.conf.js",
            action: "run"
        }))
        .on("error", function (error) {
            throw error;
        });
});

gulp.task("build", function () {
    return gulp.src(sources)
        .pipe(concat("http.js"))
        .pipe(gulp.dest("./dist/"));
});

gulp.task("lint", ["jshint", "jscs"]);
gulp.task("test", ["lint", "karma"]);
