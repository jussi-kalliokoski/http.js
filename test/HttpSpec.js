describe("Http", function () {
    "use strict";

    var server;

    it("should be defined", function () {
        Http.should.be.defined;
    });

    beforeEach(function () {
        server = sinon.fakeServer.create();
        server.autoRespond = true;
    });

    afterEach(function () {
        server.restore();
    });

    using("method shorthands", ["get", "post", "put", "delete", "patch"], function (shorthand) {
        it("should make an HTTP request", function () {
            server.respondWith(shorthand.toUpperCase(), "/foo", [200, {
                "Content-Type": "application/json"
            }, "{\"ok\":true}"]);

            return Http[shorthand]({ url: "/foo" }).then(function (result) {
                result.statusCode.should.equal(200);
                result.body.should.deep.equal({ ok: true });
                result.headers["Content-Type"].should.equal("application/json");
            });
        });
    });
});
