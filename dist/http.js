var Http = {};

Http.Errors = {};

Http.PromiseImplementation = window.Promise;

Http.Errors.HttpError = function () {
    "use strict";

    function HttpError (request, response) {
        this.name = "HttpError";
        this.message = request.method + " \"" + request.url + "\" failed with status " + response.statusCode;
        _.extend(this, response);
    }

    HttpError.prototype = new Error();

    return HttpError;
}();

Http.Errors.NetworkError = function () {
    "use strict";

    function NetworkError (request) {
        this.name = "NetworkError";
        this.message = request.method + " \"" + request.url + "\" failed due to a network error (missing CORS headers?)";
    }

    NetworkError.prototype = new Error();

    return NetworkError;
}();

Http.Errors.ResponseError = function () {
    "use strict";

    function ResponseError (request, response, reason) {
        this.name = "ResponseError";
        this.message = request.method + " \"" + request.url + "\" failed: " + reason;
        _.extend(this, response);
    }

    ResponseError.prototype = new Error();

    return ResponseError;
}();

Http.Request = function () {
    "use strict";

    function HttpRequest (options) {
        var xhr = Http.Request.createXhr();

        var promise = new Http.PromiseImplementation(function (resolve, reject) {
            xhr.onreadystatechange = function () {
                if ( xhr.readyState !== 4 ) {
                    return;
                }

                resolve(xhr);
            };

            xhr.onerror = function (error) {
                reject(new Http.Errors.NetworkError(options));
            };
        });

        xhr.open(options.method, options.url, true);

        options.prepare.call(null, xhr);

        this.send = function () {
            xhr.send(options.body);
            return promise;
        };
    }

    HttpRequest.createXhr = function () {
        return new XMLHttpRequest();
    };

    return HttpRequest;
}();

Http.Request = function (Delegate) {
    "use strict";

    var defaultOptions = {
        method: "GET",
        crossOrigin: "anonymous",
        responseType: "json",
        contentType: "form-urlencoded"
    };

    var responseTypeHandlers = {};
    var requestTypeHandlers = {};


    var prepareBody = function (options) {
        if ( options.method !== "GET" && typeof requestTypeHandlers[options.contentType].formatBody === "function" ) {
            options.body = requestTypeHandlers[options.contentType].formatBody.call(null, options.body);
        }

        options.body = options.body || null;
    };

    var prepareDefaultHeaders = function (options) {
        var headers = {};
        headers.Accept = responseTypeHandlers[options.responseType].mimetype;

        if ( options.method !== "GET" ) {
            headers["Content-Type"] = requestTypeHandlers[options.contentType].mimetype;
        }

        options.headers = _.extend(headers, options.headers);
    };

    var prepareOptions = function (options) {
        options = _.extend({}, defaultOptions, options);
        prepareDefaultHeaders(options);
        prepareBody(options);
        return options;
    };

    var prepareHeaders = function (xhr, options) {
        _.each(options.headers, function (value, key) {
            xhr.setRequestHeader(key, value);
        });
    };

    var prepareCredentials = function (xhr, options) {
        xhr.withCredentials = options.crossOrigin.toLowerCase() === "use-credentials";
    };

    var createXhrPreparate = function (options) {
        return function (xhr) {
            prepareHeaders(xhr, options);
            prepareCredentials(xhr, options);
        };
    };

    var postProcessResponseBody = function (xhr, options, response) {
        if ( typeof responseTypeHandlers[options.responseType].parseBody !== "function" ) {
            return;
        }

        try {
            response.body = responseTypeHandlers[options.responseType].parseBody.call(null, xhr);
        } catch (error) {
            throw new Http.Errors.ResponseError(options, response, "response is not of type " + options.responseType);
        }
    };

    var getResponse = function (xhr, options) {
        var response = {
            statusCode: xhr.status,
            headers: getResponseHeaders(xhr, options),
            body: processResponseBody(xhr, options)
        };

        postProcessResponseBody(xhr, options, response);

        return response;
    };

    var validateStatusCode = function (xhr, options) {
        if ( xhr.status < 200 || xhr.status >= 300 ) {
            throw new Http.Errors.HttpError(options, getResponse(xhr, options));
        }
    };

    var getResponseHeaders = function (xhr, options) {
        var headers = {};

        xhr.getAllResponseHeaders().replace(/^([-\w]+): ([^\r]+)$/gm, function (line, key, value) {
            headers[key] = value;
        });

        return headers;
    };

    var processResponseBody = function (xhr, options) {
        return xhr.responseText;
    };

    var createPostProcessor = function (options) {
        return function (xhr) {
            validateStatusCode(xhr, options);
            return getResponse(xhr, options);
        };
    };

    var overrideSend = function (delegate, options) {
        var send = delegate.send;
        delegate.send = function () {
            var promise = send.apply(this, arguments);
            return promise.then(createPostProcessor(options));
        };
    };


    function HttpRequest (options) {
        options = prepareOptions(options);

        var delegate = new Delegate({
            method: options.method,
            url: options.url,
            body: options.body,
            prepare: createXhrPreparate(options)
        });

        overrideSend(delegate, options);

        return delegate;
    }

    _.extend(HttpRequest, Delegate);

    HttpRequest.addResponseTypeHandler = function (name, handler) {
        responseTypeHandlers[name] = handler;
    };

    HttpRequest.addRequestTypeHandler = function (name, handler) {
        requestTypeHandlers[name] = handler;
    };

    return HttpRequest;
}(Http.Request);

Http.Request = function (Delegate) {
    "use strict";

    function HttpRequest (options) {
        if ( options.query ) {
            options.url = URI(options.url)
                .addSearch(options.query)
                .toString();
        }
        return new Delegate(options);
    }

    _.extend(HttpRequest, Delegate);

    return HttpRequest;
}(Http.Request);

void function () {
    "use strict";

    var createHttpMethodShortHand = function (method) {
        Http[method.toLowerCase()] = function (options) {
            options.method = method;
            var request = new Http.Request(options);
            return request.send();
        };
    };

    createHttpMethodShortHand("GET");
    createHttpMethodShortHand("POST");
    createHttpMethodShortHand("PUT");
    createHttpMethodShortHand("DELETE");
    createHttpMethodShortHand("PATCH");
}();

Http.Request.addRequestTypeHandler("form-urlencoded", {
    mimetype: "application/x-www-form-urlencoded",
    formatBody: function (body) {
        "use strict";

        return URI.buildQuery(body).replace(/%20/g, "+");
    }
});

Http.Request.addRequestTypeHandler("json", {
    mimetype: "application/json",
    formatBody: function (body) {
        "use strict";

        return JSON.stringify(body);
    }
});

Http.Request.addRequestTypeHandler("text", {
    mimetype: "text/plain"
});

Http.Request.addResponseTypeHandler("json", {
    mimetype: "application/json",
    parseBody: function (xhr) {
        "use strict";

        return JSON.parse(xhr.responseText);
    }
});

Http.Request.addResponseTypeHandler("text", {
    mimetype: "text/plain"
});

Http.Request.addResponseTypeHandler("xml", {
    mimetype: "application/xml, text/xml",
    parseBody: function (xhr) {
        "use strict";

        if ( !xhr.responseXML ) {
            throw new Error("Invalid or missing `responseXML`");
        }

        return xhr.responseXML;
    }
});
