Http.Url = function () {
    "use strict";

    function Url (urlString) {
        var self = this;
        var attributes;

        var addGetter = function (name) {
            var methodName = "get" + name[0].toUpperCase() + name.substr(1);
            self[methodName] = function () {
                return attributes[name];
            };
        };

        addGetter("href");
        addGetter("protocol");
        addGetter("host");
        addGetter("hostname");
        addGetter("port");
        addGetter("pathname");
        addGetter("search");
        addGetter("hash");
        addGetter("origin");

        var update = function () {
            var host = attributes.hostname;

            if ( attributes.port ) {
                host += ":" + attributes.port;
            }

            self.setHref(
                attributes.protocol +
                "//" +
                host +
                attributes.pathname +
                attributes.search +
                attributes.hash
            );
        };

        var addSetter = function (name) {
            var methodName = "set" + name[0].toUpperCase() + name.substr(1);
            self[methodName] = function (value) {
                attributes[name] = value;
                update();
            };
        };

        self.setHref = function (value) {
            attributes = Url.parse(value);
        };

        addSetter("protocol");

        self.setHost = function (value) {
            var splitValue = value.split(":");

            if ( splitValue.length === 1 ) {
                splitValue.push("");
            }

            attributes.hostname = splitValue[0];
            attributes.port = splitValue[1];
            update();
        };

        addSetter("hostname");
        addSetter("port");
        addSetter("pathname");
        addSetter("search");
        addSetter("hash");

        self.setOrigin = function (value) {
            self.setHref(
                value +
                attributes.pathname +
                attributes.search +
                attributes.hash
            );
        };

        self.setHref(urlString);
    }

    Url.prototype = {
        toString: function () {
            return this.getHref();
        },

        addUrlParam: function (key, value) {
            var obj = {};
            obj[key] = value;
            this.addUrlParams(obj);
        },

        addUrlParams: function (obj) {
            var query = Url.encodeQuery(obj);
            var search = this.getSearch();

            if ( search.length <= 1 ) {
                search = "?" + query;
            } else {
                search += "&" + query;
            }

            this.setSearch(search);
        },

        getUrlParams: function () {
            var params = {};
            var paramList = _.filter(this.getSearch().substr(1).split("&"));

            var addParam = function (key, value) {
                var forceArray = key.substr(-2) === "[]";

                if ( forceArray ) {
                    key = key.substr(0, key.length - 2);
                }

                if ( _.has(params, key) ) {
                    if ( _.isArray(params[key]) ) {
                        params[key].push(value);
                    } else {
                        params[key] = [params[key], value];
                    }
                } else {
                    if ( forceArray ) {
                        params[key] = [value];
                    } else {
                        params[key] = value;
                    }
                }
            };

            _.each(paramList, function (param) {
                var equalsIndex = param.indexOf("=");

                if ( equalsIndex === -1 ) {
                    addParam(param, null);
                } else {
                    var key = param.substr(0, equalsIndex);
                    var value = param.substr(equalsIndex + 1);
                    addParam(key, value);
                }
            });

            return params;
        }
    };

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

            if ( value === null ) {
                return key;
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
