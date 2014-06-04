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
            xhr.requestHeaders.Accept.should.equal("application/xml, text/xml");
            xhr.respond(200, {
                "Content-Type": "application/xml"
            }, defaultResponse);
        });

        return Http.get({
            url: "/foo",
            responseType: "xml"
        }).then(function (result) {
            result.statusCode.should.equal(200);
            result.headers["Content-Type"].should.equal("application/xml");
            result.body.documentElement.nodeName.should.equal("foo");
            result.body.documentElement.textContent.should.equal("bar");
        });
    });

    it("should throw an error if response is not valid XML", function () {
        server.respondWith("GET", "/foo", function (xhr) {
            xhr.requestHeaders.Accept.should.equal("application/xml, text/xml");
            xhr.respond(200, {
                "Content-Type": "text/xml"
            }, "<error");
            xhr.responseXML = null;
        });

        return Http.get({
            url: "/foo",
            responseType: "xml"
        }).then(function (result) {
            throw new Error("request should have failed");
        }).catch(function (error) {
            error.should.be.an.instanceOf(Http.Error);
            error.statusCode.should.equal(200);
            error.headers["Content-Type"].should.equal("text/xml");
            error.body.should.equal("<error");
            error.message.should.equal("GET \"/foo\" failed with status 200: response is not of type xml");
        });
    });
});
