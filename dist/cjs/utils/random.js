"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRandomValues = void 0;
var getRandomValues = function (holder) {
    if (crypto) {
        return crypto.getRandomValues(holder);
    }
    else if (msCrypto) {
        return msCrypto.getRandomValues(holder);
    }
    else {
        throw new Error('No crypto library found.');
    }
};
exports.getRandomValues = getRandomValues;
