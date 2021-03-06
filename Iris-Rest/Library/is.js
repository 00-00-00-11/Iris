"use strict";
/*
 Credits to https://github.com/node-fetch/node-fetch/blob/master/src/utils/is.js
*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.isURLSearchParameters = exports.isFormData = exports.isBlob = void 0;
const NAME = Symbol.toStringTag;
function isBlob(object) {
    return (typeof object === 'object' &&
        typeof object.arrayBuffer === 'function' &&
        typeof object.type === 'string' &&
        typeof object.stream === 'function' &&
        typeof object.constructor === 'function' &&
        /^(Blob|File)$/.test(object[NAME]));
}
exports.isBlob = isBlob;
;
function isFormData(object) {
    return (typeof object === 'object' &&
        typeof object.append === 'function' &&
        typeof object.set === 'function' &&
        typeof object.get === 'function' &&
        typeof object.getAll === 'function' &&
        typeof object.delete === 'function' &&
        typeof object.keys === 'function' &&
        typeof object.values === 'function' &&
        typeof object.entries === 'function' &&
        typeof object.constructor === 'function' &&
        object[NAME] === 'FormData');
}
exports.isFormData = isFormData;
;
function isURLSearchParameters(object) {
    return (typeof object === 'object' &&
        typeof object.append === 'function' &&
        typeof object.delete === 'function' &&
        typeof object.get === 'function' &&
        typeof object.getAll === 'function' &&
        typeof object.has === 'function' &&
        typeof object.set === 'function' &&
        typeof object.sort === 'function' &&
        object[NAME] === 'URLSearchParams');
}
exports.isURLSearchParameters = isURLSearchParameters;
;
