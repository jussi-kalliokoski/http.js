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
            expect(xhr.requestHeaders.Accept).to.equal("text/plain");
            xhr.respond(200, {
                "Content-Type": "text/plain"
            }, "Ok");
        });

        return Http.get({
            url: "/foo",
            responseType: "text"
        }).then(function (result) {
            expect(result.statusCode).to.equal(200);
            expect(result.headers["Content-Type"]).to.equal("text/plain");
            expect(result.body).to.equal("Ok");
        });
    });
});
