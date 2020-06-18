import { getRepository } from "typeorm";
import { Post } from "../db/entity/post";
import { PostScore } from "../db/entity/post_score";
import { User } from "../db/entity/user";
import { ISortInfo, processSortData } from "../models/sort-info";

export async function handleGetAllPosts(user_id, sort_data: ISortInfo) {
  const postRepo = getRepository(Post)
  const postScoreRepo = getRepository(PostScore)
  const builder = postRepo.createQueryBuilder('posts')
  return builder
    .innerJoin('posts.user_id', 'user')
    .innerJoin('posts.topic_id', 'topics')
    .addSelect(['user.id', 'user.name']) // we only want user's name and id
    .where('posts.user_id = user.id')
    .orderBy(processSortData(sort_data.type), sort_data.order)
    .getMany()
    // attach user's tbl_post_scores info so client can update UI.
    .then(data => Promise.all(data.map(el => postScoreRepo.findOne({
          where: {
            post_id: el.id,
            user_id
          }
        })
        .then(data => {
          return {
            ...el,
            user_post_score: data?.post_score
          }
        })
      )
    ))
}

export async function handlePostScore(post_id, user_id, post_score) {
  // translate `post_score` bool to int
  if (post_score === 'true') {
    // upvote
    post_score = 1
  } else {
    // downvote
    post_score = -1
  }

  // check if user eligible for voting
  const userRepo = getRepository(User)
  const userInfo = await userRepo.findOne({
    where: {id: user_id}
  })
  if(!userInfo) {
    throw new Error('User account doesn\'t exist')
  }
  if(userInfo.user_type == 0) {
    // admins not allowed to vote
    throw new Error('Not allowed.')
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
      postScoreData = await postScoreRepo.save({
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

    const { sum } = await postScoreRepo
      .createQueryBuilder('post_scores')
      .select('SUM(post_score)', 'sum')
      .where('post_scores.post_id = :post_id', { post_id })
      .getRawOne()

    return postRepo.createQueryBuilder()
      .update()
      .set({
        post_counter: sum
      })
      .where('id = :post_id', { post_id })
      .execute()

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