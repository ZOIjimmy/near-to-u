import React, { Component } from "react";

const CLIENT_ID = "<your Client ID>";

class InAppAccBtn extends Component {
	constructor(props) {
		super(props);

		this.state = {
			isLogined: false,
			accessToken: "",
		};

		this.login = this.login.bind(this);
		this.handleLoginFailure = this.handleLoginFailure.bind(this);
		this.logout = this.logout.bind(this);
		this.handleLogoutFailure = this.handleLogoutFailure.bind(this);
	}

	login(response) {
		//if (response.???) {
			this.setState((state) => ({
				isLogined: true,
				accessToken: response.accessToken,
			}));

		//}
	}

	logout(response) {
		this.setState((state) => ({
			isLogined: false,
			accessToken: "",
		}));
	}

	handleLoginFailure(response) {
		alert("Failed to log in");
	}

	handleLogoutFailure(response) {
		alert("Failed to log out");
	}

	getInformation() {
		
	}

	render() {
		return (
			<div>
				{this.state.isLogined ? (
					<button
						onClick={this.logout}>Logout</button>
				) : (
					<button onClick={this.login}>Login</button>
				)}
				{this.getInformation()}
			</div>
		);
	}
}

export default InAppAccBtn;