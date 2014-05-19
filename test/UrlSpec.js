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

    describe("#setHref()", function () {
        it("should reassign the complete URL", function () {
            var url = new Url("http://www.test.com/");
            url.setHref("https://foo.example.com:912/bar?q=cat&x=dog#section-1");
            url.getProtocol().should.equal("https:");
            url.getHost().should.equal("foo.example.com:912");
            url.getHostname().should.equal("foo.example.com");
            url.getPort().should.equal("912");
            url.getPathname().should.equal("/bar");
            url.getSearch().should.equal("?q=cat&x=dog");
            url.getHash().should.equal("#section-1");
            url.getOrigin().should.equal("https://foo.example.com:912");
        });
    });

    describe("#setProtocol()", function () {
        it("should reassign the protocol", function () {
            var url = new Url("https://foo.example.com:912/bar?q=cat&x=dog#section-1");
            url.setProtocol("http:");
            url.getHref().should.equal("http://foo.example.com:912/bar?q=cat&x=dog#section-1");
        });
    });

    describe("#setHost()", function () {
        it("should reassign the host", function () {
            var url = new Url("https://foo.example.com:912/bar?q=cat&x=dog#section-1");
            url.setHost("www.test.net:51");
            url.getHref().should.equal("https://www.test.net:51/bar?q=cat&x=dog#section-1");
        });

        it("should tolerate missing port", function () {
            var url = new Url("https://foo.example.com:912/bar?q=cat&x=dog#section-1");
            url.setHost("www.test.net");
            url.getHref().should.equal("https://www.test.net/bar?q=cat&x=dog#section-1");
        });
    });

    describe("#setHostname()", function () {
        it("should reassign the hostname", function () {
            var url = new Url("https://foo.example.com:912/bar?q=cat&x=dog#section-1");
            url.setHostname("www.test.net");
            url.getHref().should.equal("https://www.test.net:912/bar?q=cat&x=dog#section-1");
        });
    });

    describe("#setPort()", function () {
        it("should reassign the port", function () {
            var url = new Url("https://foo.example.com:912/bar?q=cat&x=dog#section-1");
            url.setPort("56");
            url.getHref().should.equal("https://foo.example.com:56/bar?q=cat&x=dog#section-1");
        });
    });

    describe("#setPathname()", function () {
        it("should reassign the pathname", function () {
            var url = new Url("https://foo.example.com:912/bar?q=cat&x=dog#section-1");
            url.setPathname("/api/call/");
            url.getHref().should.equal("https://foo.example.com:912/api/call/?q=cat&x=dog#section-1");
        });
    });

    describe("#setSearch()", function () {
        it("should reassign the search", function () {
            var url = new Url("https://foo.example.com:912/bar?q=cat&x=dog#section-1");
            url.setSearch("?cat=q&dog=x");
            url.getHref().should.equal("https://foo.example.com:912/bar?cat=q&dog=x#section-1");
        });
    });

    describe("#setHash()", function () {
        it("should reassign the hash", function () {
            var url = new Url("https://foo.example.com:912/bar?q=cat&x=dog#section-1");
            url.setHash("#another-section");
            url.getHref().should.equal("https://foo.example.com:912/bar?q=cat&x=dog#another-section");
        });
    });

    describe("#setOrigin()", function () {
        it("should reassign the origin", function () {
            var url = new Url("https://foo.example.com:912/bar?q=cat&x=dog#section-1");
            url.setOrigin("http://www.test.net:56");
            url.getHref().should.equal("http://www.test.net:56/bar?q=cat&x=dog#section-1");
        });
    });

    describe("#toString()", function () {
        it("should return the full url", function () {
            var url = new Url("https://foo.example.com:912/bar?q=cat&x=dog#section-1");
            url.toString().should.equal("https://foo.example.com:912/bar?q=cat&x=dog#section-1");
        });
    });

    describe("addUrlParam()", function () {
        it("should add the URL param to the search query", function () {
            var url = new Url("http://example.com");
            url.addUrlParam("x", "http://&@A asd");
            url.getHref().should.equal("http://example.com/?x=http%3A%2F%2F%26%40A%20asd");
        });

        it("should flatten arrays into multipart arrays", function () {
            var url = new Url("http://example.com");
            url.addUrlParam("x", ["foo", "bar"]);
            url.getHref().should.equal("http://example.com/?x[]=foo&x[]=bar");
        });

        it("should insert & at the beginning when the search query is not empty", function () {
            var url = new Url("http://example.com?y=bar");
            url.addUrlParam("x", "foo");
            url.getHref().should.equal("http://example.com/?y=bar&x=foo");
        });
    });

    describe("addUrlParams()", function () {
        it("should add the URL params to the search query", function () {
            var url = new Url("http://example.com");
            url.addUrlParams({
                x: "http://&@A asd",
                y: "ym"
            });
            url.getHref().should.equal("http://example.com/?x=http%3A%2F%2F%26%40A%20asd&y=ym");
        });

        it("should flatten arrays into multipart arrays", function () {
            var url = new Url("http://example.com");
            url.addUrlParams({
                x: ["foo", "bar"]
            });
            url.getHref().should.equal("http://example.com/?x[]=foo&x[]=bar");
        });

        it("should insert & at the beginning when the search query is not empty", function () {
            var url = new Url("http://example.com?y=bar");
            url.addUrlParams({
                x: "foo"
            });
            url.getHref().should.equal("http://example.com/?y=bar&x=foo");
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
