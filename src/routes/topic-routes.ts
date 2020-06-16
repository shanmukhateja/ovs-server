import { Router, Request, Response } from "express";
import { check, validationResult } from "express-validator";
import { handleCreateTopic, handleGetAllTopics } from "../controller/TopicController";
import { handleError } from "../controller/BaseController";

export const topicRouter = Router()

topicRouter.get('', (req, res) => {
  return handleGetAllTopics()
  .then(data => {
    res.send({
      status: 'OKAY',
      data
    })
  })
  .catch(err => handleError(err, res))
})

topicRouter.post('/add', [
  check('title').not().isEmpty()
], (req: Request, res: Response) => {
  const isOkay = validationResult(req)
  if(!isOkay) {
    res.sendStatus(400)
  } else {
    const { topic_title } = req.body
    handleCreateTopic(topic_title)
    .then(_ => res.send({status: 'OKAY'}))
    .catch(err => handleError(err, res))
  }
})