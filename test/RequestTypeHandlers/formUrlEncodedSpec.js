describe("Http Request with `contentType` set to `form-urlencoded`", function () {
    "use strict";

    var server;

    beforeEach(function () {
        server = sinon.fakeServer.create();
        server.autoRespond = true;
    });

    afterEach(function () {
        server.restore();
    });

    it("should URL encode the body", function () {
        server.respondWith("POST", "/foo", function (xhr) {
            xhr.requestBody.should.equal("foo=1&foo=2&bar=3+4");
            xhr.respond(200, {
                "Content-Type": "application/json"
            }, "{\"ok\":true}");
        });

        var request = new Http.Request({
            method: "POST",
            url: "/foo",
            body: {
                foo: [1, 2],
                bar: "3 4"
            }
        });

        return request.send().then(function (result) {
            result.statusCode.should.equal(200);
            result.body.should.deep.equal({ ok: true });
            result.headers["Content-Type"].should.equal("application/json");
        });
    });
});
