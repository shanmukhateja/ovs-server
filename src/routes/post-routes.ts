import { Router, Request, Response } from "express";
import { validationResult, check } from "express-validator";
import { handlePostScore, handlePostCreate, handleGetAllPosts, handleGetPostResponses, handleDeletePost } from "../controller/PostController";
import { handleError } from "../controller/BaseController";

export const postRouter = Router()

postRouter.post('', [
  check('user_id').not().isEmpty(),
  check('sort_data').notEmpty(),
  check('search_value').isString(),
  check('pagination_info').notEmpty(),
], (req: Request, res: Response) => {
  const isOkay = validationResult(req)
  if (!isOkay) {
    res.sendStatus(400)
  } else {
    const { user_id, sort_data, search_value, pagination_info } = req.body
    handleGetAllPosts(user_id, sort_data, search_value, pagination_info)
      .then(resp => {
        res.send({
          status: 'OKAY',
          data: resp.data,
          rows_count: resp.rows_count
        })
      })
      .catch(err => handleError(err, res))
  }
})

postRouter.post('/view-responses', [
  check('post_id').isNumeric()
], (req: Request, res: Response) => {
  const isOkay = validationResult(req)
  if(!isOkay) {
    res.sendStatus(400)
  } else {
    const {post_id} = req.body
    handleGetPostResponses(post_id)
    .then(resp => {
      res.send({
        status: 'OKAY',
        data: resp
      })
    })
    .catch(err => {
      console.error(err)
      res.send({
        status: 'FAIL'
      })
    })
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

postRouter.delete('', [
  check('post_id').isNumeric()
], (req: Request, res: Response) => {
  const isOkay = validationResult(req)
  if(!isOkay) {
    res.sendStatus(400)
  } else {
    const {post_id} = req.body
    handleDeletePost(post_id)
    .then(_ => res.send({
      status: 'OKAY'
    }))
    .catch(err => handleError(err, res))
  }
})