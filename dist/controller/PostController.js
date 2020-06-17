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
const typeorm_1 = require("typeorm");
const post_1 = require("../db/entity/post");
const post_score_1 = require("../db/entity/post_score");
function handleGetAllPosts(user_id) {
    return __awaiter(this, void 0, void 0, function* () {
        const postRepo = typeorm_1.getRepository(post_1.Post);
        const postScoreRepo = typeorm_1.getRepository(post_score_1.PostScore);
        const builder = postRepo.createQueryBuilder('posts');
        return builder
            .innerJoin('posts.user_id', 'user')
            .addSelect(['user.id', 'user.name']) // we only want user's name and id
            .where('posts.user_id = user.id')
            .orderBy('posts.created_at', 'DESC')
            .getMany()
            // attach user's tbl_post_scores info so client can update UI.
            .then(data => Promise.all(data.map(el => postScoreRepo.findOne({
            where: {
                post_id: el.id,
                user_id
            }
        })
            .then(data => {
            return Object.assign(Object.assign({}, el), { user_post_score: data === null || data === void 0 ? void 0 : data.post_score });
        }))));
    });
}
exports.handleGetAllPosts = handleGetAllPosts;
function handlePostScore(post_id, user_id, post_score) {
    return __awaiter(this, void 0, void 0, function* () {
        // translate `post_score` bool to int
        if (post_score === 'true') {
            // upvote
            post_score = 1;
        }
        else {
            // downvote
            post_score = -1;
        }
        const postScoreRepo = typeorm_1.getRepository(post_score_1.PostScore);
        let postScoreData = null;
        try {
            // Did this user interact with this post earlier?
            postScoreData = yield postScoreRepo.findOne({
                where: {
                    post_id,
                    user_id
                }
            });
            if (!postScoreData) {
                // create row for this post for this user
                postScoreData = yield postScoreRepo.save({
                    id: null,
                    post_id,
                    post_score,
                    user_id
                });
            }
            else {
                // user interaction for the post exists, update data
                postScoreData = Object.assign(Object.assign({}, postScoreData), { post_score });
                yield postScoreRepo.update(postScoreData.id, postScoreData);
            }
            // recount post score in post table
            const postRepo = typeorm_1.getRepository(post_1.Post);
            const { sum } = yield postScoreRepo
                .createQueryBuilder('post_scores')
                .select('SUM(post_score)', 'sum')
                .where('post_scores.post_id = :post_id', { post_id })
                .getRawOne();
            return postRepo.createQueryBuilder()
                .update()
                .set({
                post_counter: sum
            })
                .where('id = :post_id', { post_id })
                .execute();
        }
        catch (err) {
            console.error(err);
        }
    });
}
exports.handlePostScore = handlePostScore;
function handlePostCreate(topic_id, title, description, user_id) {
    return __awaiter(this, void 0, void 0, function* () {
        const postRepo = typeorm_1.getRepository(post_1.Post);
        return postRepo.save({
            description,
            post_counter: 1,
            id: null,
            topic_id,
            user_id,
            title
        });
    });
}
exports.handlePostCreate = handlePostCreate;
//# sourceMappingURL=PostController.js.map