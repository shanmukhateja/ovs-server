"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = require("bcrypt");
function hashPassword(password) {
    const saltRounds = 10;
    return bcrypt_1.hashSync(password, saltRounds);
}
exports.hashPassword = hashPassword;
function comparePassword(actualPwd, password) {
    return bcrypt_1.compareSync(password, actualPwd);
}
exports.comparePassword = comparePassword;
//# sourceMappingURL=security.js.map