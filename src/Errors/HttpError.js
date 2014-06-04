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
