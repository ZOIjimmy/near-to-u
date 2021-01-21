import { gql } from 'apollo-boost'

export const ALL_SUBSCRIPTION = gql`
  subscription
  {
    newSub
    {
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
