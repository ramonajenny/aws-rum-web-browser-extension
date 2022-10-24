import { CookieAttributes } from '../orchestration/Orchestration';
/**
 * Stores a cookie.
 *
 * @param name The cookie's name.
 * @param value The cookie's value.
 * @param attributes The domain where the cookie will be stored.
 * @param ttl Time to live -- expiry date is current date + ttl (do not use with {@code expires}).
 * @param expires The expiry date for the cookie (do not use with {@code ttl})
 */
export declare const storeCookie: (name: string, value: string, attributes: CookieAttributes, ttl?: number, expires?: Date) => void;
/**
 * Returns the current date + TTL
 *
 * @param ttl seconds to live
 */
export declare const getExpiryDate: (ttl: number) => Date;
/**
 * Removes a cookie by setting its expiry in the past.
 *
 * @param name The cookie's name.
 */
export declare const removeCookie: (name: string, attributes: CookieAttributes) => void;
/**
 * Get a cookie with a given name
 *
 * @param name The cookie's name.
 */
export declare const getCookie: (name: string) => string;
