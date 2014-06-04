describe("Http.Request (text response type handler)", function () {
    "use strict";

    var server;

    beforeEach(function () {
        server = sinon.fakeServer.create();
        server.autoRespond = true;
    });

    afterEach(function () {
        server.restore();
    });

    it("should send the request to the given URL", function () {
        server.respondWith("GET", "/foo", function (xhr) {
            xhr.requestHeaders.Accept.should.equal("text/plain");
            xhr.respond(200, {
                "Content-Type": "text/plain"
            }, "Ok");
        });

        return Http.get({
            url: "/foo",
            responseType: "text"
        }).then(function (result) {
            result.statusCode.should.equal(200);
            result.headers["Content-Type"].should.equal("text/plain");
            result.body.should.equal("Ok");
        });
    });
});
