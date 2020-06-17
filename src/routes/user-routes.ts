import { addNewUser, changeUserPassword, handleUserLogin } from '../controller/UserController';
import { handleError } from '../controller/BaseController';
import { Router, Response, Request } from 'express';
import { check, validationResult } from 'express-validator';

export const userRouter = Router();


userRouter.post('/login', [
  check('userName').not().isEmpty(),
  check('password').isLength({min: 8}),
], (req: Request,res: Response) => {
  const isOkay = validationResult(req)
  if(!isOkay) {
      res.sendStatus(400)
  } else {
      // validation success, process request
      const userName = req.body.userName
      const password = req.body.password

      handleUserLogin(userName, password)
      .then(data => res.send({status: 'OKAY', data}))
      .catch(err => {
        console.error(err)
        res.send({
          status: 'FAIL',
          error: err
        })
      })
  }
})

userRouter.post('/add', [
  check('name').not().isEmpty(),
  check('userName').not().isEmpty(),
  check('password').isLength({min: 8}),
  check('user_type').isInt()
], (req: Request, res: Response) => {
  const validate = validationResult(req)
  if(!validate.isEmpty()) {
    console.error(validate.array())
    res.sendStatus(400)
  } else {
    addNewUser(req.body)
      .then(_ => res.send({
        status: 'OKAY',
        msg: 'User created successfully'
      }))
      .catch(err => handleError(err, res))
  }
})

userRouter.put('/changePassword', [
  check('userId').not().isEmpty(),
  check('newPassword').isLength({ min: 8 })
], (req: Request, res: Response) => {
  const validate = validationResult(req)
  if (!validate.isEmpty()) {
    console.error(validate.array())
    res.sendStatus(400)
  } else {
    changeUserPassword(req.body.userId, req.body.newPassword)
      .then(_ => res.send({
        status: 'OKAY',
        msg: 'Password changed successfully'
      }))
      .catch(err => handleError(err, res))
  }
})