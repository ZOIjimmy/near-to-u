import { gql } from 'apollo-boost'

export const GET_ID = gql`
  query getPostFromId(
    $id: String!
    ){
    getPostFromId(id: $id){
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