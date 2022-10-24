export var UNKNOWN = 'unknown';
export var RUM_AMZ_PREFIX = 'com.amazon.rum';
export var RUM_AWS_PREFIX = 'com.amazonaws.rum';
// Http request event schemas
export var HTTP_EVENT_TYPE = "".concat(RUM_AMZ_PREFIX, ".http_event");
export var XRAY_TRACE_EVENT_TYPE = "".concat(RUM_AMZ_PREFIX, ".xray_trace_event");
// Web vitals event schemas
export var LCP_EVENT_TYPE = "".concat(RUM_AMZ_PREFIX, ".largest_contentful_paint_event");
export var FID_EVENT_TYPE = "".concat(RUM_AMZ_PREFIX, ".first_input_delay_event");
export var CLS_EVENT_TYPE = "".concat(RUM_AMZ_PREFIX, ".cumulative_layout_shift_event");
// Page load event schemas
export var PERFORMANCE_NAVIGATION_EVENT_TYPE = "".concat(RUM_AMZ_PREFIX, ".performance_navigation_event");
export var PERFORMANCE_RESOURCE_EVENT_TYPE = "".concat(RUM_AMZ_PREFIX, ".performance_resource_event");
export var PERFORMANCE_FIRST_PAINT_EVENT_TYPE = "".concat(RUM_AMZ_PREFIX, ".performance_first_paint_event");
export var PERFORMANCE_FIRST_CONTENTFUL_PAINT_EVENT_TYPE = "".concat(RUM_AMZ_PREFIX, ".performance_first_contentful_paint_event");
// DOM event schemas
export var DOM_EVENT_TYPE = "".concat(RUM_AMZ_PREFIX, ".dom_event");
// JS error event schemas
export var JS_ERROR_EVENT_TYPE = "".concat(RUM_AMZ_PREFIX, ".js_error_event");
// Page view event
export var PAGE_VIEW_EVENT_TYPE = "".concat(RUM_AMZ_PREFIX, ".page_view_event");
// Session start event
export var SESSION_START_EVENT_TYPE = "".concat(RUM_AMZ_PREFIX, ".session_start_event");
