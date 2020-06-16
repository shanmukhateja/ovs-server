"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const PostController_1 = require("../controller/PostController");
const BaseController_1 = require("../controller/BaseController");
exports.postRouter = express_1.Router();
exports.postRouter.get('', (req, res) => {
    PostController_1.handleGetAllPosts()
        .then(data => {
        res.send({
            status: 'OKAY',
            data
        });
    })
        .catch(err => BaseController_1.handleError(err, res));
});
/**
 * Post upvote/downvote route
 */
exports.postRouter.post('/updateScore', [
    express_validator_1.check('post_id').not().isEmpty(),
    express_validator_1.check('user_id').not().isEmpty(),
    express_validator_1.check('post_score').isBoolean(),
], (req, res) => {
    const isOkay = express_validator_1.validationResult(req);
    if (!isOkay) {
        res.sendStatus(400);
    }
    else {
        const { post_id, user_id, post_score } = req.body;
        PostController_1.handleUpvote(post_id, user_id, post_score)
            .then(_ => res.send({ status: 'OKAY' }))
            .catch(err => BaseController_1.handleError(err, res));
    }
});
exports.postRouter.post('/add', [
    express_validator_1.check('topic_id').not().isEmpty(),
    express_validator_1.check('post_title').not().isEmpty(),
    express_validator_1.check('post_descr').not().isEmpty(),
    express_validator_1.check('user_id').not().isEmpty(),
], (req, res) => {
    const isOkay = express_validator_1.validationResult(req);
    if (!isOkay) {
        res.sendStatus(400);
    }
    else {
        const { topic_id, post_title, post_descr, user_id } = req.body;
        PostController_1.handlePostCreate(topic_id, post_title, post_descr, user_id)
            .then(_ => res.send({ status: 'OKAY' }))
            .catch(err => BaseController_1.handleError(err, res));
    }
});
//# sourceMappingURL=post-routes.js.map