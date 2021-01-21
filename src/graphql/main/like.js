import { gql } from 'apollo-boost'

export const LIKE_MUTATION = gql`
  mutation like(
    $id: String!
    $user: String!
  ) {
    like(
      id: $id
      user: $user
    ) 
  }
`
