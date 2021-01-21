import { gql } from 'apollo-boost'

export const GET_PROFILE = gql`
  query getProfile(
    $account: String!
    ){
    getProfile(account: $account){
        account
        password
        email
        name
        picture
        age
        phone
        address
        introduction
    }
  }
`