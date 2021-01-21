import { gql } from 'apollo-boost'

export const POSTS_SUBSCRIPTION = gql`
  subscription postSub($id: String!)
  {
    postSub(id: $id)
    {
      mutation
      data{
        user
        text
      }
    }
  }
`
