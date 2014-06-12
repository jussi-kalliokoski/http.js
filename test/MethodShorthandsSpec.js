describe("Http method shorthands", function () {
    "use strict";

    var server;

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
                expect(result.statusCode).to.equal(200);
                expect(result.body).to.deep.equal({ ok: true });
                expect(result.headers["Content-Type"]).to.equal("application/json");
            });
        });
    });
});
