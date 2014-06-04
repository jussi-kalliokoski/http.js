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
