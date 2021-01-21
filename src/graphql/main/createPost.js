import { gql } from 'apollo-boost'

export const CREATE_POST_MUTATION = gql`
  mutation createPost(
    $author: String!
    $x: Float
    $y: Float
    $s: Float
    $title: String!
    $type: String!
    $text: String
    $picture: String
    $video: String
    $tags: [String]
  ) {
    createPost(
      data: {
        author: $author
        location: {x: $x, y: $y, s:$s}
        title: $title
        type: $type
        text: $text
        picture: $picture
        video: $video
        tags: $tags
      }
    ) 
  }
`
