Http.Request = function (Delegate) {
    "use strict";

    var defaultOptions = {
        method: "GET",
        crossOrigin: "anonymous",
        responseType: "json"
    };

    var responseTypeHandlers = {};


    var prepareBody = function (options) {
        options.body = options.body || null;
    };

    var prepareDefaultHeaders = function (options) {
        options.headers = _.extend({}, options.headers);
        options.headers.Accept = responseTypeHandlers[options.responseType].mimetype;
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

    HttpRequest.addResponseTypeHandler = function (name, handler) {
        responseTypeHandlers[name] = handler;
    };

    return HttpRequest;
}(Http.Request);
