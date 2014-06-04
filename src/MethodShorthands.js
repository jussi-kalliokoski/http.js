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
