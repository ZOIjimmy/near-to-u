import { gql } from 'apollo-boost'

export const SIGNUP_MUTATION = gql`
	mutation signup(
		$name:		String!
		$email:		String!
		$account:	String!
		$password:	String!
		$picture: 	String
	) {
		signup(
			data: {
				name:		$name
				email:		$email
				account:	$account
				password:	$password
				picture:	$picture
			}
		)
	}
`
