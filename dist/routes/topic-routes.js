"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const TopicController_1 = require("../controller/TopicController");
const BaseController_1 = require("../controller/BaseController");
exports.topicRouter = express_1.Router();
exports.topicRouter.get('', (req, res) => {
    return TopicController_1.handleGetAllTopics()
        .then(data => {
        res.send({
            status: 'OKAY',
            data
        });
    })
        .catch(err => BaseController_1.handleError(err, res));
});
exports.topicRouter.post('/add', [
    express_validator_1.check('title').not().isEmpty()
], (req, res) => {
    const isOkay = express_validator_1.validationResult(req);
    if (!isOkay) {
        res.sendStatus(400);
    }
    else {
        const { topic_title } = req.body;
        TopicController_1.handleCreateTopic(topic_title)
            .then(_ => res.send({ status: 'OKAY' }))
            .catch(err => BaseController_1.handleError(err, res));
    }
});
//# sourceMappingURL=topic-routes.js.map