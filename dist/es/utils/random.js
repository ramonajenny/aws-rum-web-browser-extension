export var getRandomValues = function (holder) {
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
