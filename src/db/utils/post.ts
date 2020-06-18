import { SortTypes } from "../../models/sort-info"
import * as moment from 'moment'
import { Post } from "../entity/post"
import { getRepository } from "typeorm"
import { PostScore } from "../entity/post_score"

export function postProcessPostData(data: Post[], user_id) {
  const postScoreRepo = getRepository(PostScore)
  return Promise.all(data.map(el => postScoreRepo.findOne({
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
  )
}

export function convertSearchSortDataColumn(sort_type: string) {
  if (sort_type == SortTypes.post_title) {
    return 'posts.title'
  } else if (sort_type == SortTypes.topic_title) {
    return 'topics.title'
  } else if (sort_type == SortTypes.post_created_at) {
    return 'posts.created_at'
  } else if (sort_type == SortTypes.user_name) {
    return 'user.name'
  }
}

export function getStartEndDates(str: string) {
  let date: moment.Moment, startDate, endDate
  const isDateOnly = !str.includes(':')
  try {
    // Check if time is provided
    if(!isDateOnly) {
      // time provided (need to subtract +05:30 to input to account for IST)
      date = moment(str, 'DD-MM-YYYY hh:mm').add('5', 'hours').add('30', 'minutes')
      startDate = moment(date).startOf('day')
      endDate = moment(date).add('1','minute') // add leeway
    } else {
      // data only (need to subtract +05:30 to input to account for IST)
      date = moment(str, 'DD-MM-YYYY').add('5', 'hours').add('30', 'minutes')
      startDate = moment(date).startOf('day').add('5', 'hours').add('30', 'minutes')
      endDate = moment(date).endOf('day').add('5', 'hours').add('30', 'minutes')
    }
    return {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString()
    }
  } catch (err) {
    console.error(err)
  }
  return null
}