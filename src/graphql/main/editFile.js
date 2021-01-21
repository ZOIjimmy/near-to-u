import { gql } from 'apollo-boost'

export const PROFILE_MUTATION = gql`
mutation editProfile(
  $account: String!
  $password: String
  $email: String
  $name: String
  $picture: String
  $age: Int
  $phone: String
  $address: String
  $introduction: String

) {
  editProfile(data: {
    account: $account
    password: $password
    email: $email
    name: $name
    picture: $picture
    age: $age
    phone: $phone
    address: $address
    introduction: $introduction
  })
}
`