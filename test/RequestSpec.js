describe("Http.Request", function () {
    "use strict";

    var Request = Http.Request;
    var server;

    it("should be a function", function () {
        expect(Request).to.be.a("function");
    });

    beforeEach(function () {
        server = sinon.fakeServer.create();
        server.autoRespond = true;
    });

    afterEach(function () {
        server.restore();
    });

    var defaultResponse = "{\"foo\":\"bar\"}";

    var assertOk = function (request) {
        return request.send().then(function (result) {
            expect(result.statusCode).to.equal(200);
            expect(result.headers["Content-Type"]).to.equal("application/json");
            expect(result.body).to.eql({
                foo: "bar",
            });
        });
    };

    it("should send the request to the given URL", function () {
        server.respondWith("GET", "http://example.com/foo?bar=baz", [200, {
            "Content-Type": "application/json",
        }, defaultResponse]);

        var request = new Request({
            url: "http://example.com/foo?bar=baz",
        });

        return assertOk(request);
    });

    it("should use the specified body", function () {
        server.respondWith("POST", "/", function (xhr) {
            expect(xhr.requestBody).to.equal("foo=bar");
            xhr.respond(200, {
                "Content-Type": "application/json",
            }, defaultResponse);
        });

        var request = new Request({
            url: "/",
            method: "POST",
            body: { foo: "bar" },
        });

        return assertOk(request);
    });

    it("should send an empty body as null", function () {
        server.respondWith("POST", "/", function (xhr) {
            expect(xhr.requestBody).to.equal(null);
            xhr.respond(200, {
                "Content-Type": "application/json",
            }, defaultResponse);
        });

        var request = new Request({
            url: "/",
            method: "POST",
            body: "",
        });

        return assertOk(request);
    });

    it("should send the request with given headers", function () {
        server.respondWith("POST", "/", function (xhr) {
            expect(xhr.requestHeaders["X-Other-Custom"]).to.equal("bar");
            xhr.respond(200, {
                "Content-Type": "application/json",
            }, defaultResponse);
        });

        var request = new Request({
            url: "/",
            method: "POST",
            headers: {
                "X-Other-Custom": "bar",
            },
        });

        return assertOk(request);
    });

    it("should send the request with given username and password", function () {
        server.respondWith("GET", "/", function (xhr) {
            expect(xhr.username).to.equal("foo");
            expect(xhr.password).to.equal("bar");
            xhr.respond(200, {
                "Content-Type": "application/json",
            }, defaultResponse);
        });

        var request = new Request({
            url: "/",
            username: "foo",
            password: "bar",
        });

        return assertOk(request);
    });

    it("should not overwrite the Content-Type header", function () {
        server.respondWith("POST", "/", function (xhr) {
            expect(xhr.requestHeaders["Content-Type"]).to.equal("foo;charset=utf-8");
            xhr.respond(200, {
                "Content-Type": "application/json",
            }, defaultResponse);
        });

        var request = new Request({
            url: "/",
            method: "POST",
            headers: {
                "Content-Type": "foo;charset=UTF-8",
            },
        });

        return assertOk(request);
    });

    using("status codes", [300, 100], function (statusCode) {
        it("should return an error for requests that don't return 2xx status", function () {
            server.respondWith(function (xhr) {
                xhr.respond(statusCode, {
                    "X-Custom": "foo",
                }, "{\"message\":\"meow\"}");
            });

            var request = new Request({
                url: "/",
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            return request.send().then(function () {
                throw new Error("request should have failed");
            }).catch(function (error) {
                expect(error).to.be.an(Http.Errors.HttpError);
                expect(error.statusCode).to.equal(statusCode);
                expect(error.headers["X-Custom"]).to.equal("foo");
                expect(error.body).to.eql({
                    message: "meow",
                });
                expect(error.message).to.equal("POST \"/\" failed with status " + statusCode);
            });
        });
    });

    it("should reject with a CancellationError when the request is cancelled", function () {
        server.respondWith(function (xhr) {
            xhr.onabort();
        });

        var request = new Request({
            url: "/",
            method: "POST",
        });

        return request.send().then(function () {
            throw new Error("request should have failed");
        }).catch(function (error) {
            expect(error).to.be.an(Http.Errors.CancellationError);
            expect(error.message).to.equal("POST \"/\" was cancelled");
        });
    });

    it("should return an error for request that fails due to a network error", function () {
        server.respondWith(function (xhr) {
            xhr.onerror();
        });

        var request = new Request({
            url: "/",
            method: "POST",
            headers: {
                "Content-Type": "foo;charset=UTF-8",
            },
        });

        return request.send().then(function () {
            throw new Error("request should have failed");
        }).catch(function (error) {
            expect(error).to.be.an(Http.Errors.NetworkError);
            expect(error.message).to.equal("POST \"/\" failed due to a network error (missing CORS headers?)");
        });
    });

    it("should return a network error when the request finishes with a status code 0", function () {
        server.respondWith(function (xhr) {
            xhr.respond(0, {}, null);
        });

        var request = new Request({
            url: "/",
            method: "POST",
            headers: {
                "Content-Type": "foo;charset=UTF-8",
            },
        });

        return request.send().then(function () {
            throw new Error("request should have failed");
        }).catch(function (error) {
            expect(error).to.be.an(Http.Errors.NetworkError);
            expect(error.message).to.equal("POST \"/\" failed due to a network error (missing CORS headers?)");
        });
    });

    it("should send the request with credentials, if `crossOrigin` attribute is set to `use-credentials`", function () {
        server.respondWith("GET", "http://otherdomain.com/foo", function (xhr) {
            expect(xhr.withCredentials).to.equal(true);
            xhr.respond(200, {
                "Content-Type": "application/json",
            }, defaultResponse);
        });

        var request = new Request({
            url: "http://otherdomain.com/foo",
            crossOrigin: "Use-Credentials",
        });

        return assertOk(request);
    });

    it("should default to not sending the request with credentials", function () {
        server.respondWith("GET", "http://otherdomain.com/foo", function (xhr) {
            expect(xhr.withCredentials).to.equal(false);
            xhr.respond(200, {
                "Content-Type": "application/json",
            }, defaultResponse);
        });

        var request = new Request({
            url: "http://otherdomain.com/foo",
        });

        return assertOk(request);
    });

    describe(".createXhr()", function () {
        it("should create a new XMLHttpRequest", function () {
            expect(Request.createXhr()).to.be.an(XMLHttpRequest);
        });
    });
});
