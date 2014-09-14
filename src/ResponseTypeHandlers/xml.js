Http.Request.addResponseTypeHandler("xml", {
    mimetype: "application/xml, text/xml",
    parseBody: function (xhr) {
        "use strict";

        if ( !xhr.responseXML ) {
            throw new Error("Invalid or missing `responseXML`");
        }

        return xhr.responseXML;
    },
});
