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

    describe(".parse()", function () {
        it("should parse the URL correctly", function () {
            var url = Url.parse("https://foo.example.com:912/bar?q=cat&x=dog#section-1");
            url.protocol.should.equal("https:");
            url.host.should.equal("foo.example.com:912");
            url.hostname.should.equal("foo.example.com");
            url.port.should.equal("912");
            url.pathname.should.equal("/bar");
            url.search.should.equal("?q=cat&x=dog");
            url.hash.should.equal("#section-1");
            url.origin.should.equal("https://foo.example.com:912");
        });

        it("should not add the port to origin if it's not present", function () {
            var url = Url.parse("https://foo.example.com/bar?q=cat&x=dog#section-1");
            url.origin.should.equal("https://foo.example.com");
        });

        it("should default origin to the current origin", function () {
            var url = Url.parse("/asd");
            url.origin.should.not.equal("");
        });

        it("should work with URLs with just `/` as pathname", function () {
            var url = Url.parse("http://foo.bar/");
            url.pathname.should.equal("/");
        });

        it("should throw if the string is not a valid URL", function () {
            var fn = function () {
                Url.parse("~");
            };

            fn.should.throw(Error);
            fn.should.throw("Invalid URL");
        });
    });
});
