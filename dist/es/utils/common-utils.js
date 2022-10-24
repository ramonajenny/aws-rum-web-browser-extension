export var ResourceType;
(function (ResourceType) {
    ResourceType["OTHER"] = "other";
    ResourceType["STYLESHEET"] = "stylesheet";
    ResourceType["DOCUMENT"] = "document";
    ResourceType["SCRIPT"] = "script";
    ResourceType["IMAGE"] = "image";
    ResourceType["FONT"] = "font";
})(ResourceType || (ResourceType = {}));
var extensions = [
    {
        name: ResourceType.STYLESHEET,
        list: ['css', 'less']
    },
    {
        name: ResourceType.DOCUMENT,
        list: ['htm', 'html', 'ts', 'doc', 'docx', 'pdf', 'xls', 'xlsx']
    },
    {
        name: ResourceType.SCRIPT,
        list: ['js']
    },
    {
        name: ResourceType.IMAGE,
        list: [
            'ai',
            'bmp',
            'gif',
            'ico',
            'jpeg',
            'jpg',
            'png',
            'ps',
            'psd',
            'svg',
            'tif',
            'tiff'
        ]
    },
    {
        name: ResourceType.FONT,
        list: ['fnt', 'fon', 'otf', 'ttf', 'woff']
    }
];
export var shuffle = function (a) {
    for (var i = a.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var v = a[i];
        a[i] = a[j];
        a[j] = v;
    }
};
export var getResourceFileType = function (url) {
    var filename = url.substring(url.lastIndexOf('/') + 1);
    var extension = filename
        .substring(filename.lastIndexOf('.') + 1)
        .split(/[?#]/)[0];
    var ext = ResourceType.OTHER;
    extensions.forEach(function (type) {
        if (type.list.indexOf(extension) > -1) {
            ext = type.name;
        }
    });
    return ext;
};
/* Helpers */
export var httpStatusText = {
    '0': 'Abort Request',
    '200': 'OK',
    '201': 'Created',
    '202': 'Accepted',
    '203': 'Non-Authoritative Information',
    '204': 'No Content',
    '205': 'Reset Content',
    '206': 'Partial Content',
    '300': 'Multiple Choices',
    '301': 'Moved Permanently',
    '302': 'Found',
    '303': 'See Other',
    '304': 'Not Modified',
    '305': 'Use Proxy',
    '306': 'Unused',
    '307': 'Temporary Redirect',
    '400': 'Bad Request',
    '401': 'Unauthorized',
    '402': 'Payment Required',
    '403': 'Forbidden',
    '404': 'Not Found',
    '405': 'Method Not Allowed',
    '406': 'Not Acceptable',
    '407': 'Proxy Authentication Required',
    '408': 'Request Timeout',
    '409': 'Conflict',
    '410': 'Gone',
    '411': 'Length Required',
    '412': 'Precondition Required',
    '413': 'Request Entry Too Large',
    '414': 'Request-URI Too Long',
    '415': 'Unsupported Media Type',
    '416': 'Requested Range Not Satisfiable',
    '417': 'Expectation Failed',
    '418': 'I"m a teapot',
    '500': 'Internal Server Error',
    '501': 'Not Implemented',
    '502': 'Bad Gateway',
    '503': 'Service Unavailable',
    '504': 'Gateway Timeout',
    '505': 'HTTP Version Not Supported'
};
