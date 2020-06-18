import { Router, Request, Response } from "express";
import { validationResult, check } from "express-validator";
import { handlePostScore, handlePostCreate, handleGetAllPosts } from "../controller/PostController";
import { handleError } from "../controller/BaseController";

export const postRouter = Router()

postRouter.post('', [
  check('user_id').not().isEmpty(),
  check('sort_data').notEmpty()
], (req: Request, res: Response) => {
  const isOkay = validationResult(req)
  if (!isOkay) {
    res.sendStatus(400)
  } else {
    const { user_id, sort_data } = req.body
    handleGetAllPosts(user_id, sort_data)
      .then(data => {
        res.send({
          status: 'OKAY',
          data
        })
      })
      .catch(err => handleError(err, res))
  }
})

/**
 * Post upvote/downvote route
 */
postRouter.post('/updateScore', [
  check('post_id').not().isEmpty(),
  check('user_id').not().isEmpty(),
  check('post_score').isBoolean(),
], (req: Request, res: Response) => {
  const isOkay = validationResult(req)
  if (!isOkay) {
    res.sendStatus(400)
  } else {
    const { post_id, user_id, post_score } = req.body

    handlePostScore(post_id, user_id, post_score)
      .then(_ => res.send({ status: 'OKAY' }))
      .catch(err => {
        console.error(err)
        res.send({
          status: 'FAIL',
          error: err.message
        })
      })
  }
})

postRouter.post('/add', [
  check('topic_id').not().isEmpty(),
  check('post_title').not().isEmpty(),
  check('post_descr').not().isEmpty(),
  check('user_id').not().isEmpty(),
], (req: Request, res: Response) => {
  const isOkay = validationResult(req)
  if (!isOkay) {
    res.sendStatus(400)
  } else {
    const { topic_id, post_title, post_descr, user_id } = req.body
    handlePostCreate(topic_id, post_title, post_descr, user_id)
      .then(_ => res.send({ status: 'OKAY' }))
      .catch(err => handleError(err, res))
  }
})