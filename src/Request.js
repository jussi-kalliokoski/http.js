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
