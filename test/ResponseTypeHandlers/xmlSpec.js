describe("Http.Request (xml response type handler)", function () {
    "use strict";

    var server;

    beforeEach(function () {
        server = sinon.fakeServer.create();
        server.autoRespond = true;
    });

    afterEach(function () {
        server.restore();
    });

    var defaultResponse = "<foo>bar</foo>";

    it("should send the request to the given URL", function () {
        server.respondWith("GET", "/foo", function (xhr) {
            expect(xhr.requestHeaders.Accept).to.equal("application/xml, text/xml");
            xhr.respond(200, {
                "Content-Type": "application/xml",
            }, defaultResponse);
        });

        return Http.get({
            url: "/foo",
            responseType: "xml",
        }).then(function (result) {
            expect(result.statusCode).to.equal(200);
            expect(result.headers["Content-Type"]).to.equal("application/xml");
            expect(result.body.documentElement).to.be.an("object");
        });
    });

    it("should throw an error if response is not valid XML", function () {
        server.respondWith("GET", "/foo", function (xhr) {
            expect(xhr.requestHeaders.Accept).to.equal("application/xml, text/xml");
            xhr.respond(200, {
                "Content-Type": "text/xml",
            }, "<error");
            xhr.responseXML = null;
        });

        return Http.get({
            url: "/foo",
            responseType: "xml",
        }).then(function (result) {
            throw new Error("request should have failed");
        }).catch(function (error) {
            expect(error).to.be.an(Http.Errors.ResponseError);
            expect(error.statusCode).to.equal(200);
            expect(error.headers["Content-Type"]).to.equal("text/xml");
            expect(error.body).to.equal("<error");
            expect(error.message).to.equal("GET \"/foo\" failed: response is not of type xml");
        });
    });
});
