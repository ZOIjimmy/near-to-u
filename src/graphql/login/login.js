import { gql } from 'apollo-boost'

export const LOGIN_QUERY = gql`
  	query login(
		$account:		String!
		$password:		String!
	) {
		login(
			account:	$account
			password:	$password
		)
	}
`
