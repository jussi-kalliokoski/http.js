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

    describe("#getHref()", function () {
        it("should return the href of the URL", function () {
            var url = new Url("https://foo.example.com:912/bar?q=cat&x=dog#section-1");
            url.getHref().should.equal("https://foo.example.com:912/bar?q=cat&x=dog#section-1");
        });
    });

    describe("#getProtocol()", function () {
        it("should return the protocol of the URL", function () {
            var url = new Url("https://foo.example.com:912/bar?q=cat&x=dog#section-1");
            url.getProtocol().should.equal("https:");
        });
    });

    describe("#getHost()", function () {
        it("should return the host of the URL", function () {
            var url = new Url("https://foo.example.com:912/bar?q=cat&x=dog#section-1");
            url.getHost().should.equal("foo.example.com:912");
        });
    });

    describe("#getHostname()", function () {
        it("should return the hostname of the URL", function () {
            var url = new Url("https://foo.example.com:912/bar?q=cat&x=dog#section-1");
            url.getHostname().should.equal("foo.example.com");
        });
    });

    describe("#getPort()", function () {
        it("should return the port of the URL", function () {
            var url = new Url("https://foo.example.com:912/bar?q=cat&x=dog#section-1");
            url.getPort().should.equal("912");
        });
    });

    describe("#getPathname()", function () {
        it("should return the pathname of the URL", function () {
            var url = new Url("https://foo.example.com:912/bar?q=cat&x=dog#section-1");
            url.getPathname().should.equal("/bar");
        });
    });

    describe("#getSearch()", function () {
        it("should return the search of the URL", function () {
            var url = new Url("https://foo.example.com:912/bar?q=cat&x=dog#section-1");
            url.getSearch().should.equal("?q=cat&x=dog");
        });
    });

    describe("#getHash()", function () {
        it("should return the hash of the URL", function () {
            var url = new Url("https://foo.example.com:912/bar?q=cat&x=dog#section-1");
            url.getHash().should.equal("#section-1");
        });
    });

    describe("#getOrigin()", function () {
        it("should return the origin of the URL", function () {
            var url = new Url("https://foo.example.com:912/bar?q=cat&x=dog#section-1");
            url.getOrigin().should.equal("https://foo.example.com:912");
        });
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
