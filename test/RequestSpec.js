describe("Http.Request", function () {
    "use strict";

    var Request = Http.Request;
    var server;

    it("should be a function", function () {
        Request.should.be.a("function");
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
            result.statusCode.should.equal(200);
            result.headers["Content-Type"].should.equal("application/json");
            result.body.should.deep.equal({
                foo: "bar"
            });
        });
    };

    it("should send the request to the given URL", function () {
        server.respondWith("GET", "http://example.com/foo?bar=baz", [200, {
            "Content-Type": "application/json"
        }, defaultResponse]);

        var request = new Request({
            url: "http://example.com/foo?bar=baz"
        });

        return assertOk(request);
    });

    it("should use the specified body", function () {
        server.respondWith("POST", "/", function (xhr) {
            xhr.requestBody.should.equal("foo");
            xhr.respond(200, {
                "Content-Type": "application/json"
            }, defaultResponse);
        });

        var request = new Request({
            url: "/",
            method: "POST",
            body: "foo"
        });

        return assertOk(request);
    });

    it("should send an empty body as null", function () {
        server.respondWith("POST", "/", function (xhr) {
            expect(xhr.requestBody).to.equal(null);
            xhr.respond(200, {
                "Content-Type": "application/json"
            }, defaultResponse);
        });

        var request = new Request({
            url: "/",
            method: "POST",
            body: ""
        });

        return assertOk(request);
    });

    it("should send the request with given headers", function () {
        server.respondWith("POST", "/", function (xhr) {
            xhr.requestHeaders["X-Other-Custom"].should.equal("bar");
            xhr.respond(200, {
                "Content-Type": "application/json"
            }, defaultResponse);
        });

        var request = new Request({
            url: "/",
            method: "POST",
            headers: {
                "X-Other-Custom": "bar"
            }
        });

        return assertOk(request);
    });

    it("should not overwrite the Content-Type header", function () {
        server.respondWith("POST", "/", function (xhr) {
            xhr.requestHeaders["Content-Type"].should.equal("foo;charset=utf-8");
            xhr.respond(200, {
                "Content-Type": "application/json"
            }, defaultResponse);
        });

        var request = new Request({
            url: "/",
            method: "POST",
            headers: {
                "Content-Type": "foo;charset=UTF-8"
            }
        });

        return assertOk(request);
    });

    using("status codes", [300, 100], function (statusCode) {
        it("should return an error for requests that don't return 2xx status", function () {
            server.respondWith(function (xhr) {
                xhr.respond(statusCode, {
                    "X-Custom": "foo"
                }, "{\"message\":\"meow\"}");
            });

            var request = new Request({
                url: "/",
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                }
            });

            return request.send().then(function () {
                throw new Error("request should have failed");
            }).catch(function (error) {
                error.should.be.an.instanceOf(Http.Error);
                error.statusCode.should.equal(statusCode);
                error.headers["X-Custom"].should.equal("foo");
                error.body.should.deep.equal({
                    message: "meow"
                });
                error.message.should.equal("POST \"/\" failed with status " + statusCode);
            });
        });
    });

    it("should return an error for request that fail due to a network error", function () {
        server.respondWith(function (xhr) {
            xhr.onerror();
        });

        var request = new Request({
            url: "/",
            method: "POST",
            headers: {
                "Content-Type": "foo;charset=UTF-8"
            }
        });

        return request.send().then(function () {
            throw new Error("request should have failed");
        }).catch(function (error) {
            error.should.be.an.instanceOf(Http.Error);
            error.message.should.equal("POST \"/\" failed due to a network error (missing CORS headers?)");
        });
    });

    it("should send the request with credentials, if `crossOrigin` attribute is set to `use-credentials`", function () {
        server.respondWith("GET", "http://otherdomain.com/foo", function (xhr) {
            xhr.withCredentials.should.equal(true);
            xhr.respond(200, {
                "Content-Type": "application/json"
            }, defaultResponse);
        });

        var request = new Request({
            url: "http://otherdomain.com/foo",
            crossOrigin: "Use-Credentials"
        });

        return assertOk(request);
    });

    it("should default to not sending the request with credentials", function () {
        server.respondWith("GET", "http://otherdomain.com/foo", function (xhr) {
            xhr.withCredentials.should.equal(false);
            xhr.respond(200, {
                "Content-Type": "application/json"
            }, defaultResponse);
        });

        var request = new Request({
            url: "http://otherdomain.com/foo"
        });

        return assertOk(request);
    });

    describe(".createXhr()", function () {
        it("should create a new XMLHttpRequest", function () {
            Request.createXhr().should.be.an.instanceOf(XMLHttpRequest);
        });
    });
});
