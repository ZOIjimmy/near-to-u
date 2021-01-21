import "./App.css";
import React from "react";
import { Button, Input, message, Tag } from "antd";

//react router
import { HashRouter as Router, Switch, Route, Redirect} from "react-router-dom";

//page component
import { Home, Login, Main } from "./pages";
import {MainSearch, MainPost, MainProfile, MainVideoEditor} from "./pages/main/main_pages";

function App() {
	return (
		<Router>
			<Switch>
				<Route exact path="/">
					<Redirect to="/login" />
				</Route>
				<Route path="/login">
					<Login />
				</Route>
				<Route exact path = "/main">
					<Main />
				</Route>
					<Route path = "/main/search">
						<MainSearch/>
					</Route>
					<Route path = "/main/post">
						<MainPost/>
					</Route>
					<Route path = "/main/profile">
						<MainProfile/>
					</Route>
					<Route path = "/main/videoEditor">
						<MainVideoEditor/>
					</Route>
				
			</Switch>
		</Router>
	);
}

export default App;
