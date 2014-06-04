describe("Http Request with `contentType` set to `text`", function () {
    "use strict";

    var server;

    beforeEach(function () {
        server = sinon.fakeServer.create();
        server.autoRespond = true;
    });

    afterEach(function () {
        server.restore();
    });

    it("should not encode the body", function () {
        server.respondWith("POST", "/foo", function (xhr) {
            xhr.requestBody.should.equal("foo");
            xhr.respond(200, {
                "Content-Type": "application/json"
            }, "{\"ok\":true}");
        });

        var request = new Http.Request({
            method: "POST",
            url: "/foo",
            contentType: "text",
            body: "foo"
        });

        return request.send().then(function (result) {
            result.statusCode.should.equal(200);
            result.body.should.deep.equal({ ok: true });
            result.headers["Content-Type"].should.equal("application/json");
        });
    });
});
