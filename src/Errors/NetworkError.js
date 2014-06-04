Http.Errors.NetworkError = function () {
    "use strict";

    function NetworkError (request) {
        this.name = "NetworkError";
        this.message = request.method + " \"" + request.url + "\" failed due to a network error (missing CORS headers?)";
    }

    NetworkError.prototype = new Error();

    return NetworkError;
}();
