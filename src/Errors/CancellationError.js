Http.Errors.CancellationError = function () {
    "use strict";

    function CancellationError (request) {
        this.name = "CancellationError";
        this.message = request.method + " \"" + request.url + "\" was cancelled";
    }

    CancellationError.prototype = new Error();

    return CancellationError;
}();
