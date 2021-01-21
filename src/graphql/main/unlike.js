import { gql } from 'apollo-boost'

export const UNLIKE_MUTATION = gql`
  mutation unlike(
    $id: String!
    $user: String!
  ) {
    unlike(
      id: $id
      user: $user
    ) 
  }
`
