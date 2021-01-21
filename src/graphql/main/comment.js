import { gql } from 'apollo-boost'

export const COMMENT_MUTATION = gql`
mutation comment(
  $id: String!
  $user: String!
  $text: String!
) {
  comment(
      id: $id,
      user: $user,
      text: $text
  ) 
}
`