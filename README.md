# http.js

[![Build Status](https://travis-ci.org/jussi-kalliokoski/http.js.svg)](https://travis-ci.org/jussi-kalliokoski/http.js)
[![Coverage Status](https://img.shields.io/coveralls/jussi-kalliokoski/http.js.svg)](https://coveralls.io/r/jussi-kalliokoski/http.js)

http.js is a Promises/A+ compliant HTTP request library for client-side applications.

## Getting Started

To get started, you should first get yourself a copy of http.js:

### via bower

```sh
$ bower install --save http-js
```

### via npm

```sh
$ npm install --save-dev http-js
```

### via github releases

Alternatively, if you don't like package managers, you can get yourself the latest version from [GitHub Releases](https://github.com/jussi-kalliokoski/http.js/releases).

## Browser Support

Courtesy of the test suite that's run on [BrowserStack](https://www.browserstack.com/), the officially supported browsers are as follows:

* Chrome: Latest stable version.
* Firefox: Latest stable version.
* Opera: Latest stable version.
* Internet Explorer: 8, 9, 10, 11.

## Usage

### A simple request

Supported shorthand methods are `get`, `post`, `put`, `delete` and `patch`.

```javascript
Http.get({ url: "/foo" }).then(function (response) {
    // logs something like:
    // {
    //   statusCode: 200,
    //   headers: {
    //     "Content-Type": "application/json;encoding=UTF-8"
    //   },
    //   body: {
    //     foo: "bar"
    //   }
    // }
    console.log(response);
})["catch"](function (error) {
    // See section titled `Errors` for further information.
    console.error(error);
});
```

### Query parameters

```javascript
// Makes a request to `/foo?bar=1&bar=2&baz=3`
Http.get({
    url: "/foo",
    query: {
        bar: [1, 2],
        baz: 3
    }
});
```

### Response types

By default, `json` is used. You can select one of `json`, `text` and `xml` by using the `responseType` option:

```javascript
Http.get({
    url: "/foo",
    responseType: "xml"
});
```

### Request types

By default, `form-urlencoded` is used. You can select one of `form-urlencoded`, `text` and `json` by using the `contentType` option:

```javascript
Http.post({
    url: "/foo",
    contentType: "json",
    body: {
        foo: "bar"
    }
});
```

### Cross Origin Resource Sharing, a.k.a. CORS, with cookies

NOTE: Only works if the browser supports CORS.

```javascript
Http.get({
    url: "/foo",
    crossOrigin: "use-credentials"
});
```

### Custom Headers

```javascript
Http.get({
    url: "/foo",
    headers: {
        "X-My-Header": "bar"
    }
});
```

### Changing Promises Implementation

By default, http.js uses ES6 promises. You can either use them with the [polyfill](https://github.com/jakearchibald/es6-promise), or plug your favorite Promises/A+ implementation in:

```javascript
// Kris Kowal's Q
Http.PromiseImplementation = Q;

// RSVP
Http.PromiseImplementation = RSVP.Promise;
```

### Errors

http.js rejects its requests with three kind of errors:

#### HttpError

This error is triggered if the server responds with a status code other than 2xx.

##### Properties

* `type` (string): This is always set to `HttpError`.
* `message` (string): This is something like `GET <url> failed with status 404`.
* `statusCode` (number): The response status code the server returned.
* `headers` (object): The response headers the server returned.
* `body`: (any): The response body the server returned.

#### ResponseError

This error is triggered if the response from the server could not be successfully processed.

##### Properties

* `type` (string): This is always set to `ResponseError`.
* `message` (string): This is something like `GET <url> failed with status 404`.
* `statusCode` (number): The response status code the server returned.
* `headers` (object): The response headers the server returned.
* `body`: (any): The response body the server returned.


#### NetworkError

This error is triggered if no response is available. Possible reasons:

* Connection to server could not be established.
* Connection timed out.
* Server did not respond.
* Server doesn't support CORS for this endpoint.

##### Properties

* `type` (string): This is always set to `NetworkError`.
* `message` (string): This is something like `GET <url> failed with status due to a network error (missing CORS headers?)`.

## Contributing

Contributions are most welcome! If you're having problems and don't know why, search the issues to see if someone's had the same issue. If not, file a new issue so we can solve it together and leave the solution visible to others facing the same problem as well. If you find bugs, file an issue, preferably with good reproduction steps. If you want to be totally awesome, you can make a PR to go with your issue, containing a new test case that fails currently!

### Development

Development is pretty straightforward, it's all JS and the standard node stuff works:

To install dependencies:

```bash
$ npm install
```

To run the tests:

```bash
$ npm test
```

Then just make your awesome feature and a PR for it. Don't forget to file an issue first, or start with an empty PR so others can see what you're doing and discuss it so there's a a minimal amount of wasted effort.

Do note that the test coverage is currently a whopping 100%. Let's keep it that way! Remember: if it's not in the requirements specification (i.e. the tests), it's not needed, and thus unnecessary bloat.
