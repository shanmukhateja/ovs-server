import { getRepository } from "typeorm";
import { Post } from "../db/entity/post";
import { PostScore } from "../db/entity/post_score";
import { User } from "../db/entity/user";
import { ISortInfo, SortTypes } from "../models/sort-info";
import { convertSearchSortDataColumn, getStartEndDates, postProcessPostData } from "../db/utils/post";
import { IPaginationInfo } from "../models/pagination-info";

export async function handleGetAllPosts(user_id, sort_data: ISortInfo, search_value: string, pagination_info: IPaginationInfo | number) {
  // setup page_index value
  let skip_index = 0
  const items_count_per_page = pagination_info['itemsPerPage'] || 2
  let page_index = parseInt(pagination_info['page']?.toString() || pagination_info)

  if (page_index > 1) {
    skip_index = (page_index - 1) * items_count_per_page
  } else {
    skip_index = 0
  }

  const postRepo = getRepository(Post)
  let base = postRepo.createQueryBuilder('posts')
    .innerJoin('posts.user_id', 'user')
    .innerJoin('posts.topic_id', 'topics')
    .addSelect(['user.id', 'user.name']) // we only want user's name and id
    .addSelect(['topics.id', 'topics.title']) // include topic title and id
    .where('posts.user_id = user.id')

  // total no. of rows (for Pagination)
  const rows_count = await base.getCount()
  base = base.skip(skip_index)
    .take(items_count_per_page)

  // check if search str is date
  const isDate = search_value.includes('-')
  if (!isDate) {
    return base
      .where(`${convertSearchSortDataColumn(SortTypes.post_title)} LIKE :search_value`, {
        search_value: `%${search_value}%`
      })
      .orWhere(`${convertSearchSortDataColumn(SortTypes.topic_title)} LIKE :search_value`, {
        search_value: `%${search_value}%`
      })
      .orWhere(`${convertSearchSortDataColumn(SortTypes.user_name)} LIKE :search_value`, {
        search_value: `%${search_value}%`
      })
      .orderBy(convertSearchSortDataColumn(sort_data.type), sort_data.order)
      .getMany()
      // attach user's tbl_post_scores info so client can update UI.
      .then(data => postProcessPostData(data, user_id, rows_count))
  } else {
    const { startDate, endDate } = getStartEndDates(search_value)
    // is Date
    return base
      .where(`${convertSearchSortDataColumn(SortTypes.post_created_at)} BETWEEN :startDate AND :endDate`, {
        startDate,
        endDate
      })
      .orderBy(convertSearchSortDataColumn(sort_data.type), sort_data.order)
      .getMany()
      // attach user's tbl_post_scores info so client can update UI.
      .then(data => postProcessPostData(data, user_id, rows_count))
  }

}

export function handleGetPostResponses(post_id) {
  const postScoresRepo = getRepository(PostScore)
  return postScoresRepo.createQueryBuilder('post_scores')
    .where('post_scores.post_id = :post_id', { post_id })
    .innerJoinAndSelect(User, 'users', '1')
    .select(['users.id AS user_id', 'users.name AS user_name', 'post_scores.post_score as user_score'])
    .getRawMany()
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
    where: { id: user_id }
  })
  if (!userInfo) {
    throw new Error('User account doesn\'t exist')
  }
  if (userInfo.user_type == 0) {
    // admins not allowed to vote
    throw new Error('Not allowed.')
  }
  const postScoreRepo = getRepository(PostScore)
  let postScoreData: PostScore = null

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
    await postScoreRepo.save(postScoreData)
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

export async function handleDeletePost(post_id) {
  const postRepo = getRepository(Post)
  const postScoreRepo = getRepository(PostScore)
  // delete post scores info of Post
  await postScoreRepo.createQueryBuilder()
  .delete()
  .where('post_id = :post_id', {post_id})
  .execute()
  // delete Post
  return postRepo.createQueryBuilder()
  .delete()
  .where('id = :post_id', {post_id})
  .execute()
}