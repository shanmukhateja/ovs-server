import { getRepository } from "typeorm";
import { Topic } from "../db/entity/topic";

export function handleGetAllTopics() {
  const topicRepo = getRepository(Topic)
  return topicRepo.find()
}

export function handleCreateTopic(title) {
  const topicRepo = getRepository(Topic)
  
  return topicRepo.save({
    title
  })
}