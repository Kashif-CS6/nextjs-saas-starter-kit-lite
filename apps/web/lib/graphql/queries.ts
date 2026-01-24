import { gql } from '@apollo/client'

export const GET_PAGINATED_POSTS = gql`
  query GetPaginatedPosts($limit: Int!, $offset: Int!) {
    blog_posts(
      limit: $limit
      offset: $offset
      order_by: { published_at: desc }
    ) {
      id
      title
      excerpt
      author_name
      published_at
    }
    blog_posts_aggregate {
      aggregate {
        count
      }
    }
  }
`

export const GET_POST_BY_ID = gql`
  query GetPostById($id: uuid!) {
    blog_posts_by_pk(id: $id) {
      id
      title
      body
      author_name
      published_at
      created_at
      updated_at
    }
  }
`

export const CREATE_POST = gql`
  mutation CreatePost($title: String!, $body: String!, $author_id: uuid!, $author_name: String!) {
    insert_blog_posts_one(object: {
      title: $title
      body: $body
      author_id: $author_id
      author_name: $author_name
    }) {
      id
      title
      body
      author_name
      published_at
    }
  }
`