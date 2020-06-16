import "reflect-metadata";
import { createConnection } from "typeorm";
import * as express from "express";
import * as bodyParser from "body-parser";
import * as cors from "cors";
import { userRouter } from './routes/user-routes';
import { postRouter } from './routes/post-routes'
import { topicRouter } from './routes/topic-routes'

// create connection with database
createConnection().then(async connection => {

  // create express app
  const app = express();
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(cors())

  app.set('dbConn', connection)

  // routes
  app.use('/users', userRouter)
  app.use('/posts', postRouter)
  app.use('/topics', topicRouter)

  // run app
  const port = 4600
  app.listen(port);

  console.log(`Express application is up and running on port ${port}`);
})
  .catch(error => console.log("TypeORM connection error: ", error));
