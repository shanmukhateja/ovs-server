export interface ISortInfo {

  type: SortTypes,
  order: SortOrder,
}

export enum SortTypes {
  'post_title' = 'post_title', 'topic_title' = 'topic_title',
   'post_created_at' = 'post_created_at', 'user_name' = 'user_name'
}

export enum SortOrder {
  'asc' = 'ASC',
  'desc' = 'DESC'
}

export function processSortData(sort_type: string) {
  if(sort_type == SortTypes.post_title) {
    return 'posts.title'
  } else if(sort_type == SortTypes.topic_title) {
    return 'topics.title'
  } else if(sort_type == SortTypes.post_created_at) {
    return 'posts.created_at'
  } else if(sort_type == SortTypes.user_name) {
    return 'users.name'
  }
}
