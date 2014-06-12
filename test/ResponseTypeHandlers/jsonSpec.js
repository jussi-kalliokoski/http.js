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
            expect(xhr.requestHeaders.Accept).to.equal("application/json");
            xhr.respond(200, {
                "Content-Type": "application/json"
            }, defaultResponse);
        });

        return Http.get({
            url: "http://otherdomain.com/foo",
            responseType: "json"
        }).then(function (result) {
            expect(result.statusCode).to.equal(200);
            expect(result.headers["Content-Type"]).to.equal("application/json");
            expect(result.body).to.deep.equal({
                foo: "bar"
            });
        });
    });

    it("should throw an error if response is not valid JSON", function () {
        server.respondWith("GET", "http://otherdomain.com/foo", function (xhr) {
            expect(xhr.requestHeaders.Accept).to.equal("application/json");
            xhr.respond(200, {
                "Content-Type": "application/json"
            }, "{foo:1}");
        });

        return Http.get({
            url: "http://otherdomain.com/foo",
            responseType: "json"
        }).then(function () {
            throw new Error("request should have failed");
        })["catch"](function (error) {
            expect(error).to.be.an.instanceOf(Http.Errors.ResponseError);
            expect(error.statusCode).to.equal(200);
            expect(error.headers["Content-Type"]).to.equal("application/json");
            expect(error.body).to.equal("{foo:1}");
            expect(error.message).to.equal("GET \"http://otherdomain.com/foo\" failed: response is not of type json");
        });
    });
});
