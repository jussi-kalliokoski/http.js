Http.Request.addRequestTypeHandler("form-urlencoded", {
    mimetype: "application/x-www-form-urlencoded",
    formatBody: function (body) {
        "use strict";

        return URI.buildQuery(body).replace(/%20/g, "+");
    },
});
