import { gql } from 'apollo-boost'

export const SEARCH_QUERY = gql`
query search(
	$text: String
	$type: Int!
	$limit: Int!
) {
	search(
		text: $text
		type: $type
		limit: $limit
	) {
		id
		author
		location{
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
		comments{
			user
			text
		}
		time
		id
	}
}
`

	
