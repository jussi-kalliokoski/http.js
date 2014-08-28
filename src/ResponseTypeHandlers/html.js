Http.Request.addResponseTypeHandler("html", {
    mimetype: "text/html",
    parseBody: function (xhr) {
        "use strict";

        var fragment = document.createDocumentFragment();
        fragment.innerHTML = xhr.responseText;
        return fragment;
    },
});
