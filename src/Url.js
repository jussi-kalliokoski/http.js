Http.Url = function () {
    "use strict";

    function Url () {
    }

    var encodeParameter = function (key, value) {
        return key + "=" + encodeURIComponent(value);
    };

    Url.encodeQuery = function (parameters) {
        return _.flatten(_.map(parameters, function (value, key) {
            if ( _.isArray(value) ) {
                return _.map(value, function (value) {
                    return encodeParameter(key + "[]", value);
                });
            }

            return encodeParameter(key, value);
        })).join("&");
    };

    return Url;
}();
