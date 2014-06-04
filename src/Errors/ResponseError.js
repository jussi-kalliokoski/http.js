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
