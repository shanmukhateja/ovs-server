"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UserController_1 = require("../controller/UserController");
const BaseController_1 = require("../controller/BaseController");
const express_1 = require("express");
const express_validator_1 = require("express-validator");
exports.userRouter = express_1.Router();
exports.userRouter.post('/login', [
    express_validator_1.check('userName').not().isEmpty(),
    express_validator_1.check('password').isLength({ min: 8 }),
], (req, res) => {
    const isOkay = express_validator_1.validationResult(req);
    if (!isOkay) {
        res.sendStatus(400);
    }
    else {
        // validation success, process request
        const userName = req.body.userName;
        const password = req.body.password;
        UserController_1.handleUserLogin(userName, password)
            .then(data => res.send({ status: 'OKAY', data }))
            .catch(err => {
            console.error(err);
            res.send({
                status: 'FAIL',
                error: err
            });
        });
    }
});
exports.userRouter.post('/add', [
    express_validator_1.check('name').not().isEmpty(),
    express_validator_1.check('userName').not().isEmpty(),
    express_validator_1.check('password').isLength({ min: 8 }),
    express_validator_1.check('user_type').isInt()
], (req, res) => {
    const validate = express_validator_1.validationResult(req);
    if (!validate.isEmpty()) {
        console.error(validate.array());
        res.sendStatus(400);
    }
    else {
        UserController_1.addNewUser(req.body)
            .then(_ => res.send({
            status: 'OKAY',
            msg: 'User created successfully'
        }))
            .catch(err => BaseController_1.handleError(err, res));
    }
});
exports.userRouter.put('/changePassword', [
    express_validator_1.check('userId').not().isEmpty(),
    express_validator_1.check('newPassword').isLength({ min: 8 })
], (req, res) => {
    const validate = express_validator_1.validationResult(req);
    if (!validate.isEmpty()) {
        console.error(validate.array());
        res.sendStatus(400);
    }
    else {
        UserController_1.changeUserPassword(req.body.userId, req.body.newPassword)
            .then(_ => res.send({
            status: 'OKAY',
            msg: 'Password changed successfully'
        }))
            .catch(err => BaseController_1.handleError(err, res));
    }
});
//# sourceMappingURL=user-routes.js.map