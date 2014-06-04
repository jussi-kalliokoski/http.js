Http.Request = function (Delegate) {
    "use strict";

    var defaultOptions = {
        method: "GET"
    };

    var prepareBody = function (options) {
        options.body = options.body || null;
    };

    var prepareOptions = function (options) {
        options = _.extend({}, defaultOptions, options);
        prepareBody(options);
        return options;
    };

    var prepareHeaders = function (xhr, options) {
        _.each(options.headers, function (value, key) {
            xhr.setRequestHeader(key, value);
        });
    };

    var createXhrPreparate = function (options) {
        return function (xhr) {
            prepareHeaders(xhr, options);
        };
    };

    var getResponse = function (xhr, options) {
        return {
            statusCode: xhr.status,
            headers: getResponseHeaders(xhr, options),
            body: processResponseBody(xhr, options)
        };
    };

    var validateStatusCode = function (xhr, options) {
        if ( xhr.status < 200 || xhr.status >= 300 ) {
            throw new Http.Error(options, getResponse(xhr, options));
        }
    };

    var getResponseHeaders = function (xhr, options) {
        var headers = {};

        xhr.getAllResponseHeaders().replace(/^([-\w]+): (.+)$/m, function (line, key, value) {
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


    var createHttpMethodShortHand = function (method) {
        Http[method.toLowerCase()] = function (options) {
            options.method = method;
            var request = new HttpRequest(options);
            return request.send();
        };
    };

    createHttpMethodShortHand("GET");
    createHttpMethodShortHand("POST");
    createHttpMethodShortHand("PUT");
    createHttpMethodShortHand("DELETE");
    createHttpMethodShortHand("PATCH");

    return HttpRequest;
}(Http.Request);
