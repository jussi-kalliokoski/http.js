"use strict";

var gulp = require("gulp");
var jshint = require("gulp-jshint");
var jscs = require("gulp-jscs");
var istanbul = require("gulp-istanbul");
var concat = require("gulp-concat");
var es3ify = require("gulp-es3ify");
var wrap = require("gulp-wrap-umd");
var runSequence = require("run-sequence");
var spawn = require("child_process").spawn;

var sources = [
    "./src/index.js",
    "./src/Errors/*.js",
    "./src/Request.js",
    "./src/RequestSugar.js",
    "./src/RequestUrlHelpers.js",
    "./src/MethodShorthands.js",
    "./src/RequestTypeHandlers/*.js",
    "./src/ResponseTypeHandlers/*.js",
];

var configFiles = [
    "./gulpfile.js",
    "./config/karma/karma.conf.js",
    "./test/**/*.js",
];

var umdSpec = {
    namespace: "Http",
    exports: "Http",
    deps: [{
        name: "_",
        cjsName: "lodash",
        globalName: "_",
    }, {
        name: "URI",
        cjsName: "URIjs",
        globalName: "URI",
    }],
};

function handleError (error) {
    throw error;
}

gulp.task("jscs", function jscsTask () {
    return gulp.src(sources.concat(configFiles), { base: "./" })
        .pipe(jscs("./.jscs.json"))
        .on("error", handleError);
});

gulp.task("jshint", function jshintTask () {
    return gulp.src(sources.concat(configFiles), { base: "./" })
        .pipe(jshint())
        .pipe(jshint.reporter("default"))
        .pipe(jshint.reporter("fail"))
        .on("error", handleError);
});

gulp.task("build", function buildTask () {
    return gulp.src(sources, { base: "./" })
        .pipe(es3ify())
        .pipe(concat("http.js"))
        .pipe(wrap(umdSpec))
        .pipe(gulp.dest("./dist/"));
});

gulp.task("build:specs", function buildSpecsTask () {
    gulp.src("./test/**/*Spec.js", { base: "./" })
        .pipe(es3ify())
        .pipe(gulp.dest("./.tmp/"));
});

gulp.task("build:tests", ["build:specs"], function buildTestsTask () {
    return gulp.src(sources, { base: "./" })
        .pipe(istanbul())
        .pipe(es3ify())
        .pipe(concat("http.js"))
        .pipe(wrap(umdSpec))
        .pipe(gulp.dest("./.tmp/"));
});

gulp.task("karma", function karmaTask (callback) {
    var child = spawn("./node_modules/.bin/karma", ["start", "./config/karma/karma.conf.js", "--single-run"], {
        stdio: "inherit",
    });

    child.on("close", function (exitCode) {
        if ( exitCode !== 0 ) {
            handleError(new Error("Tests failed"));
            return;
        }

        callback();
    });
});

gulp.task("lint", ["jshint", "jscs"]);
gulp.task("test", function (callback) {
    runSequence("lint", "build:tests", "karma", callback);
});
