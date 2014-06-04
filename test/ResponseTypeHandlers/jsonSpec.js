describe("Http.Request (json response type handler)", function () {
    "use strict";

    var server;

    beforeEach(function () {
        server = sinon.fakeServer.create();
        server.autoRespond = true;
    });

    afterEach(function () {
        server.restore();
    });

    var defaultResponse = "{\"foo\":\"bar\"}";

    it("should send the request to the given URL", function () {
        server.respondWith("GET", "http://otherdomain.com/foo", function (xhr) {
            xhr.requestHeaders.Accept.should.equal("application/json");
            xhr.respond(200, {
                "Content-Type": "application/json"
            }, defaultResponse);
        });

        return Http.get({
            url: "http://otherdomain.com/foo",
            responseType: "json"
        }).then(function (result) {
            result.statusCode.should.equal(200);
            result.headers["Content-Type"].should.equal("application/json");
            result.body.should.deep.equal({
                foo: "bar"
            });
        });
    });

    it("should throw an error if response is not valid JSON", function () {
        server.respondWith("GET", "http://otherdomain.com/foo", function (xhr) {
            xhr.requestHeaders.Accept.should.equal("application/json");
            xhr.respond(200, {
                "Content-Type": "application/json"
            }, "{foo:1}");
        });

        return Http.get({
            url: "http://otherdomain.com/foo",
            responseType: "json"
        }).then(function () {
            throw new Error("request should have failed");
        }).catch(function (error) {
            error.should.be.an.instanceOf(Http.Error);
            error.statusCode.should.equal(200);
            error.headers["Content-Type"].should.equal("application/json");
            error.body.should.equal("{foo:1}");
            error.message.should.equal("GET \"http://otherdomain.com/foo\" failed with status 200: response is not of type json");
        });
    });
});
