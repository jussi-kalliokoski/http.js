Http.Request.addRequestTypeHandler("json", {
    mimetype: "application/json",
    formatBody: function (body) {
        "use strict";

        return JSON.stringify(body);
    }
});
