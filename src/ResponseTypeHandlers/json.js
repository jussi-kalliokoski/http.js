Http.Request.addResponseTypeHandler("json", {
    mimetype: "application/json",
    parseBody: function (xhr) {
        "use strict";

        return JSON.parse(xhr.responseText);
    },
});
