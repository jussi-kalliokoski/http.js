describe("Http.Request (html response type handler)", function () {
    "use strict";

    var server;

    beforeEach(function () {
        server = sinon.fakeServer.create();
        server.autoRespond = true;
    });

    afterEach(function () {
        server.restore();
    });

    var defaultResponse = "<div>Foo</div>";

    it("should send the request to the given URL", function () {
        server.respondWith("GET", "http://otherdomain.com/foo", function (xhr) {
            expect(xhr.requestHeaders.Accept).to.equal("text/html");
            xhr.respond(200, {
                "Content-Type": "text/html",
            }, defaultResponse);
        });

        return Http.get({
            url: "http://otherdomain.com/foo",
            responseType: "html",
        }).then(function (result) {
            expect(result.statusCode).to.equal(200);
            expect(result.headers["Content-Type"]).to.equal("text/html");
            expect(result.body.innerHTML).to.match(/<div>foo<\/div>/i);
        });
    });
});
