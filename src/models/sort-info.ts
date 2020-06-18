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
