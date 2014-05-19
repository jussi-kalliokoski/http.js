Http.Url = function () {
    "use strict";

    function Url () {
    }

    Url.location = location;

    var encodeParameter = function (key, value) {
        return key + "=" + encodeURIComponent(value);
    };

    Url.encodeQuery = function (parameters) {
        return _.flatten(_.map(parameters, function (value, key) {
            if ( _.isArray(value) ) {
                return _.map(value, function (value) {
                    return encodeParameter(key + "[]", value);
                });
            }

            return encodeParameter(key, value);
        })).join("&");
    };

    /*
     * Collected backreferences:
     * $1: origin
     * $2: protocol
     * $3: host
     * $4: hostname
     * $5: port
     * $6: pathname
     * $7: search
     * $8: hash
    */
    var urlParserRegExp = /^(((?:\w+):)\/\/(([^:\/\s\?\#]+)(?::(\d+))?))?((?:\/\w+)*\/(?:[\w\-\.]+[^\#?\s]+)?)?(\?[^\#]*)?(\#.*)?$/;
    var urlDefaults = {
        href: "",
        protocol: "",
        host: "",
        hostname: "",
        port: "",
        pathname: "/",
        search: "",
        hash: "",
        origin: ""
    };

    Url.parse = function (url) {
        if ( !urlParserRegExp.test(url) ) {
            throw new Error("Invalid URL");
        }

        var parsed = {
            href: RegExp["$&"],
            origin: RegExp.$1,
            protocol: RegExp.$2,
            host: RegExp.$3,
            hostname: RegExp.$4,
            port: RegExp.$5,
            pathname: RegExp.$6,
            search: RegExp.$7,
            hash: RegExp.$8
        };

        _.each(parsed, function (value, key) {
            parsed[key] = value || urlDefaults[key];
        });

        if ( !parsed.origin ) {
            return Url.parse(
                Url.parse(Url.location.href).origin +
                parsed.pathname +
                parsed.search +
                parsed.hash
            );
        }

        return parsed;
    };

    return Url;
}();
