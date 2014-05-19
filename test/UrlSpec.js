describe("Http.Url", function () {
    "use strict";

    var Url = Http.Url;

    it("should be a function", function () {
        Url.should.be.a("function");
    });

    it("should provide an instance of Url", function () {
        var url = new Url("http://example.com");
        url.should.be.an.instanceOf(Url);
    });

    describe(".encodeQuery()", function () {
        it("should convert a key-value map to a URI encoded string", function () {
            var data = {
                x: "http://&@A asd",
                y: "ym"
            };

            Url.encodeQuery(data).should.equal("x=http%3A%2F%2F%26%40A%20asd&y=ym");
        });

        it("should flatten arrays into multipart arrays", function () {
            var data = {
                x: ["foo", "bar"]
            };

            Url.encodeQuery(data).should.equal("x[]=foo&x[]=bar");
        });
    });
});
