Http.Error = function () {
    "use strict";

    function HttpError (request, response) {
        this.name = "HttpError";

        if ( response ) {
            this.message = request.method + " \"" + request.url + "\" failed with status " + response.statusCode;
            _.extend(this, response);
        } else {
            this.message = request.method + " \"" + request.url + "\" failed due to a network error (missing CORS headers?)";
        }
    }

    HttpError.prototype = Error.prototype;

    return HttpError;
}();
