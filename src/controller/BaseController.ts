import { Response } from "express";

export function handleError(err, response: Response) {
  console.error(err)
  response.send({
    status: 'FAIL'
  })
}