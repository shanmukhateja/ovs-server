"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const topic_1 = require("../db/entity/topic");
function handleGetAllTopics() {
    const topicRepo = typeorm_1.getRepository(topic_1.Topic);
    return topicRepo.find();
}
exports.handleGetAllTopics = handleGetAllTopics;
function handleCreateTopic(title) {
    const topicRepo = typeorm_1.getRepository(topic_1.Topic);
    return topicRepo.save({
        title
    });
}
exports.handleCreateTopic = handleCreateTopic;
//# sourceMappingURL=TopicController.js.map