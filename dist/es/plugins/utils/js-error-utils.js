var isObject = function (error) {
    var type = typeof error;
    return (type === 'object' || type === 'function') && !!error;
};
var buildBaseJsErrorEvent = function (errorEvent) {
    var rumEvent = {
        version: '1.0.0',
        type: 'undefined',
        message: 'undefined'
    };
    if (errorEvent.type !== undefined) {
        rumEvent.type = errorEvent.type;
    }
    if (errorEvent.message !== undefined) {
        rumEvent.message = errorEvent.message;
    }
    if (errorEvent.filename !== undefined) {
        rumEvent.filename = errorEvent.filename;
    }
    if (errorEvent.lineno !== undefined) {
        rumEvent.lineno = errorEvent.lineno;
    }
    if (errorEvent.colno !== undefined) {
        rumEvent.colno = errorEvent.colno;
    }
    return rumEvent;
};
var appendErrorPrimitiveDetails = function (rumEvent, error) {
    // Keep unhandledrejection as type as it will write to rumEvent.message
    if (rumEvent.type !== 'unhandledrejection') {
        rumEvent.type = error.toString();
    }
    rumEvent.message = error.toString();
};
var appendErrorObjectDetails = function (rumEvent, error, stackTraceLength) {
    // error may extend Error here, but it is not guaranteed (i.e., it could
    // be any object)
    if (error.name) {
        rumEvent.type = error.name;
    }
    if (error.message) {
        rumEvent.message = error.message;
    }
    if (error.fileName) {
        rumEvent.filename = error.fileName;
    }
    if (error.lineNumber) {
        rumEvent.lineno = error.lineNumber;
    }
    if (error.columnNumber) {
        rumEvent.colno = error.columnNumber;
    }
    if (stackTraceLength && error.stack) {
        rumEvent.stack =
            error.stack.length > stackTraceLength
                ? error.stack.substring(0, stackTraceLength) + '...'
                : error.stack;
    }
};
export var isErrorPrimitive = function (error) {
    return error !== Object(error) && error !== undefined && error !== null;
};
export var errorEventToJsErrorEvent = function (errorEvent, stackTraceLength) {
    var rumEvent = buildBaseJsErrorEvent(errorEvent);
    var error = errorEvent.error;
    if (isObject(error)) {
        appendErrorObjectDetails(rumEvent, error, stackTraceLength);
    }
    else if (isErrorPrimitive(error)) {
        appendErrorPrimitiveDetails(rumEvent, error);
    }
    return rumEvent;
};
