"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkPermissions = void 0;
const constants_1 = require("../constants");
function checkPermissions(permissions, check) {
    if (typeof (permissions) !== 'number' && typeof (permissions) !== 'bigint') {
        throw new Error('Permissions has to be an integer');
    }
    permissions = BigInt(permissions);
    switch (typeof (check)) {
        case 'bigint':
            {
                return (permissions & check) === check;
            }
            ;
        case 'number':
            {
                return checkPermissions(permissions, BigInt(check));
            }
            ;
        case 'object':
            {
                if (Array.isArray(check)) {
                    return check.every((value) => checkPermissions(permissions, value));
                }
            }
            ;
            break;
        case 'string':
            {
                check = check.toUpperCase();
                if (check in constants_1.Permissions) {
                    return checkPermissions(permissions, constants_1.Permissions[check]);
                }
                else {
                    throw new Error(`Unknown Permission: ${check}`);
                }
            }
            ;
    }
    throw new Error('Only a string, integer, or an array of strings/integers are allowed to check with.');
}
exports.checkPermissions = checkPermissions;
;
