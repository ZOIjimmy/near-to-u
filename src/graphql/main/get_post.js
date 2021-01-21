import { gql } from 'apollo-boost'

export const GET_POST = gql`
  query getPosts(
    $x: Float!
    $y: Float!
    $s: Float
    ){
    getPosts(locale: {
      x: $x
      y: $y
      s: $s
    }){
      author
      location
      {
        x
        y
        s
      }
      type
      title
      text
      picture
      video
      tags
      likes
      comments
      {
        user
        text
      }
      time
      id

    }
  }
`