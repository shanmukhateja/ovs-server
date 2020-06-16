"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const user_routes_1 = require("./routes/user-routes");
const post_routes_1 = require("./routes/post-routes");
const topic_routes_1 = require("./routes/topic-routes");
// create connection with database
typeorm_1.createConnection().then((connection) => __awaiter(void 0, void 0, void 0, function* () {
    // create express app
    const app = express();
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(cors());
    app.set('dbConn', connection);
    // routes
    app.use('/users', user_routes_1.userRouter);
    app.use('/posts', post_routes_1.postRouter);
    app.use('/topics', topic_routes_1.topicRouter);
    // run app
    const port = 4600;
    app.listen(port);
    console.log(`Express application is up and running on port ${port}`);
}))
    .catch(error => console.log("TypeORM connection error: ", error));
//# sourceMappingURL=index.js.map