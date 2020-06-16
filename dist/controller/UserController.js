"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const user_1 = require("../db/entity/user");
const security_1 = require("../utils/security");
function handleUserLogin(userName, password) {
    return __awaiter(this, void 0, void 0, function* () {
        // get user table ORM
        const repo = typeorm_1.getRepository(user_1.User);
        // hash password
        const userInfo = yield repo.findOne({
            where: {
                userName
            }
        });
        if (!userInfo) {
            // user acc does not exist
            return Promise.reject('User account does not exist.');
        }
        else {
            const result = security_1.comparePassword(userInfo.password, password);
            if (result) {
                const fd = Object.assign(Object.assign({}, userInfo), { password: '' });
                return Promise.resolve(fd);
            }
            else {
                return Promise.reject('Invalid username or password');
            }
        }
    });
}
exports.handleUserLogin = handleUserLogin;
function addNewUser(user) {
    const model = typeorm_1.getRepository(user_1.User);
    // hash password
    const hashedPwd = security_1.hashPassword(user.password);
    return model.save(Object.assign(Object.assign({}, user), { password: hashedPwd }));
}
exports.addNewUser = addNewUser;
function changeUserPassword(userId, newPassword) {
    const repo = typeorm_1.getRepository(user_1.User);
    return repo.update(userId, { password: newPassword });
}
exports.changeUserPassword = changeUserPassword;
//# sourceMappingURL=UserController.js.map