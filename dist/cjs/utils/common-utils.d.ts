export declare enum ResourceType {
    OTHER = "other",
    STYLESHEET = "stylesheet",
    DOCUMENT = "document",
    SCRIPT = "script",
    IMAGE = "image",
    FONT = "font"
}
export declare const shuffle: (a: any[]) => void;
export declare const getResourceFileType: (url: string) => ResourceType;
export declare const httpStatusText: {
    '0': string;
    '200': string;
    '201': string;
    '202': string;
    '203': string;
    '204': string;
    '205': string;
    '206': string;
    '300': string;
    '301': string;
    '302': string;
    '303': string;
    '304': string;
    '305': string;
    '306': string;
    '307': string;
    '400': string;
    '401': string;
    '402': string;
    '403': string;
    '404': string;
    '405': string;
    '406': string;
    '407': string;
    '408': string;
    '409': string;
    '410': string;
    '411': string;
    '412': string;
    '413': string;
    '414': string;
    '415': string;
    '416': string;
    '417': string;
    '418': string;
    '500': string;
    '501': string;
    '502': string;
    '503': string;
    '504': string;
    '505': string;
};
