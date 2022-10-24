/**
 * Stores a cookie.
 *
 * @param name The cookie's name.
 * @param value The cookie's value.
 * @param attributes The domain where the cookie will be stored.
 * @param ttl Time to live -- expiry date is current date + ttl (do not use with {@code expires}).
 * @param expires The expiry date for the cookie (do not use with {@code ttl})
 */
export var storeCookie = function (name, value, attributes, ttl, expires) {
    var cookie = name + '=';
    cookie += value || '';
    if (expires !== undefined) {
        cookie += "; Expires=".concat(expires.toUTCString());
    }
    else if (ttl !== undefined) {
        cookie += "; Expires=".concat(getExpiryDate(ttl).toUTCString());
    }
    cookie += "; Domain=".concat(attributes.domain);
    cookie += "; Path=".concat(attributes.path);
    cookie += "; SameSite=".concat(attributes.sameSite);
    cookie += attributes.secure ? '; Secure' : '';
    document.cookie = cookie;
};
/**
 * Returns the current date + TTL
 *
 * @param ttl seconds to live
 */
export var getExpiryDate = function (ttl) {
    return new Date(new Date().getTime() + ttl * 1000);
};
/**
 * Removes a cookie by setting its expiry in the past.
 *
 * @param name The cookie's name.
 */
export var removeCookie = function (name, attributes) {
    var cookie = name + '=';
    cookie += "; Expires=".concat(new Date(0));
    cookie += "; Domain=".concat(attributes.domain);
    cookie += "; Path=".concat(attributes.path);
    cookie += "; SameSite=".concat(attributes.sameSite);
    cookie += attributes.secure ? 'Secure' : '';
    document.cookie = cookie;
};
/**
 * Get a cookie with a given name
 *
 * @param name The cookie's name.
 */
export var getCookie = function (name) {
    var cookies = document.cookie.split('; ');
    for (var _i = 0, cookies_1 = cookies; _i < cookies_1.length; _i++) {
        var cookie = cookies_1[_i];
        var split = cookie.split('=');
        if (split[0] === name) {
            return split[1];
        }
    }
    return '';
};
