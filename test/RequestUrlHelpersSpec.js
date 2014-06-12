describe("Http Request URL Helpers", function () {
    "use strict";

    var server;

    beforeEach(function () {
        server = sinon.fakeServer.create();
        server.autoRespond = true;
    });

    afterEach(function () {
        server.restore();
    });

    var createSimpleTest = function (expected, parameters) {
        return function () {
            server.respondWith(parameters.method, expected, [200, {
                "Content-Type": "application/json"
            }, "{\"ok\":true}"]);

            var request = new Http.Request(parameters);

            return request.send().then(function (result) {
                expect(result.statusCode).to.equal(200);
                expect(result.body).to.deep.equal({ ok: true });
                expect(result.headers["Content-Type"]).to.equal("application/json");
            });
        };
    };

    it("should add parameters in `query` option to the search query", createSimpleTest(
        "/foo?bar=1&cat=5&cat=6", {
        method: "GET",
        url: "/foo",
        query: {
            bar: 1,
            cat: [5, 6]
        }
    }));
});
