import { getRepository } from "typeorm";
import { Post } from "../db/entity/post";
import { PostScore } from "../db/entity/post_score";

export function handleGetAllPosts() {
  const postRepo = getRepository(Post)
  const builder = postRepo.createQueryBuilder('posts')
  
  return builder
  .innerJoin('posts.user_id', 'user')
  .addSelect(['user.id', 'user.name']) // we only want user's name and id
  .where('posts.user_id = user.id')
  .orderBy('posts.created_at', 'DESC')
  .getMany()
}

export async function handleUpvote(post_id, user_id, post_score) {
  // translate `post_score` bool to int
  if(post_score) {
    // upvote
    post_score = 1
  } else {
    // downvote
    post_score = -1
  }
  const postScoreRepo = getRepository(PostScore)
  let postScoreData = null

  try {
    // Did this user interact with this post earlier?
    postScoreData = await postScoreRepo.findOne({
      where: {
        post_id,
        user_id
      }
    })
    if (!postScoreData) {
      // create row for this post for this user
      postScoreData = await postScoreRepo.create({
        id: null,
        post_id,
        post_score,
        user_id
      })
    } else {
      // user interaction for the post exists, update data
      postScoreData = { ...postScoreData, post_score }
      await postScoreRepo.update(postScoreData.id, postScoreData)
    }

    // recount post score in post table
    const postRepo = getRepository(Post)
    
    return postRepo.query(`UPDATE "${postRepo.metadata.tableName}" SET post_counter = (SELECT SUM(post_score) FROM "${postScoreRepo.metadata.tableName}" WHERE post_id = ${post_id});`)
  } catch (err) {
    console.error(err)
  }
}

export async function handlePostCreate(topic_id, title, description, user_id) {
  const postRepo = getRepository(Post)

  return postRepo.save({
    description,
    post_counter: 1,
    id: null,
    topic_id,
    user_id,
    title
  })
}