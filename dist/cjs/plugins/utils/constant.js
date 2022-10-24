"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SESSION_START_EVENT_TYPE = exports.PAGE_VIEW_EVENT_TYPE = exports.JS_ERROR_EVENT_TYPE = exports.DOM_EVENT_TYPE = exports.PERFORMANCE_FIRST_CONTENTFUL_PAINT_EVENT_TYPE = exports.PERFORMANCE_FIRST_PAINT_EVENT_TYPE = exports.PERFORMANCE_RESOURCE_EVENT_TYPE = exports.PERFORMANCE_NAVIGATION_EVENT_TYPE = exports.CLS_EVENT_TYPE = exports.FID_EVENT_TYPE = exports.LCP_EVENT_TYPE = exports.XRAY_TRACE_EVENT_TYPE = exports.HTTP_EVENT_TYPE = exports.RUM_AWS_PREFIX = exports.RUM_AMZ_PREFIX = exports.UNKNOWN = void 0;
exports.UNKNOWN = 'unknown';
exports.RUM_AMZ_PREFIX = 'com.amazon.rum';
exports.RUM_AWS_PREFIX = 'com.amazonaws.rum';
// Http request event schemas
exports.HTTP_EVENT_TYPE = "".concat(exports.RUM_AMZ_PREFIX, ".http_event");
exports.XRAY_TRACE_EVENT_TYPE = "".concat(exports.RUM_AMZ_PREFIX, ".xray_trace_event");
// Web vitals event schemas
exports.LCP_EVENT_TYPE = "".concat(exports.RUM_AMZ_PREFIX, ".largest_contentful_paint_event");
exports.FID_EVENT_TYPE = "".concat(exports.RUM_AMZ_PREFIX, ".first_input_delay_event");
exports.CLS_EVENT_TYPE = "".concat(exports.RUM_AMZ_PREFIX, ".cumulative_layout_shift_event");
// Page load event schemas
exports.PERFORMANCE_NAVIGATION_EVENT_TYPE = "".concat(exports.RUM_AMZ_PREFIX, ".performance_navigation_event");
exports.PERFORMANCE_RESOURCE_EVENT_TYPE = "".concat(exports.RUM_AMZ_PREFIX, ".performance_resource_event");
exports.PERFORMANCE_FIRST_PAINT_EVENT_TYPE = "".concat(exports.RUM_AMZ_PREFIX, ".performance_first_paint_event");
exports.PERFORMANCE_FIRST_CONTENTFUL_PAINT_EVENT_TYPE = "".concat(exports.RUM_AMZ_PREFIX, ".performance_first_contentful_paint_event");
// DOM event schemas
exports.DOM_EVENT_TYPE = "".concat(exports.RUM_AMZ_PREFIX, ".dom_event");
// JS error event schemas
exports.JS_ERROR_EVENT_TYPE = "".concat(exports.RUM_AMZ_PREFIX, ".js_error_event");
// Page view event
exports.PAGE_VIEW_EVENT_TYPE = "".concat(exports.RUM_AMZ_PREFIX, ".page_view_event");
// Session start event
exports.SESSION_START_EVENT_TYPE = "".concat(exports.RUM_AMZ_PREFIX, ".session_start_event");
