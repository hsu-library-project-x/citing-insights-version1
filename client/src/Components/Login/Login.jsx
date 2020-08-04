import React, { Component } from 'react';
import { withRouter, Redirect } from 'react-router-dom';
import { GoogleLogin } from "react-google-login";
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import { Grid, Button } from "@material-ui/core";
import Base64Image from './Base64Image.jsx';
import config from "../../config.json";

class Login extends Component {
	constructor(props) {
		super(props);

		this.height = window.innerHeight / 1.29;
	}

	onFailure = (err) => {
		console.log(err);
	};

	responseGoogle = (response) => {

		let access_token = response.accessToken === undefined ? response.wc.access_token : response.accessToken;
			
		const tokenBlob = new Blob(
			[JSON.stringify({ access_token: access_token  }, null, 2)],
			{ type: 'application/json' }
		);

		const options = {
			method: 'POST',
			body: tokenBlob,
			mode: 'cors',
			cache: 'default',
			headers: {
				'Content-Type': 'application/json',
				'Accept': 'application/json',
				'Access-Control-Allow': true,
			},
			credentials: 'include'
		};

		fetch('/api/users/auth', options).then(r => {
			r.json().then(user => {
				localStorage.setItem('user', JSON.stringify({
					isAuthenticated: true,
					user: user
				  }));
				this.props.passInfoLogin(true, user);
			});
		});
	};

	render() {

		if (this.props.isAuthenticated === true) {
			return (
				<Redirect to={{
					pathname: '/tasks',
					state: { from: this.props.location }
				}} />)
		} else {

			const theme = createMuiTheme({
				palette: {
					primary: { main: this.props.configurations.primaryColor },
					secondary: { main: this.props.configurations.secondaryColor }
				},
			});

			const imageBase64String = this.props.configurations.images.img.data;


			return (
				<MuiThemeProvider theme={theme}>
					<Grid container spacing={0} style={{ margin: '.01em', padding: '.01em' }}>
						<Grid item xs={7}>
							<Base64Image imageBase64String={imageBase64String} />
							{/* <Box style={{backgroundImage: `url(${`data:image/jpeg;base64,${img}`} )`, height: this.height}} /> */}
						</Grid>
						<Grid item xs={5}>
							<h1 style={{ textAlign: "center", margin: "1em" }}> Your Opportunity To Change the Assessment World </h1>
							<div style={{ textAlign: "center", marginTop: "2em" }} id="google">
								<GoogleLogin
									clientId={config.GOOGLE_CLIENT_ID}
									render={renderProps => (
										<Button
											color="primary"
											variant="contained"
											onClick={renderProps.onClick}
											disabled={renderProps.disabled}>
											Login with Google
									</Button>
									)}
									accessType="offline"
									approvalPrompt="force"
									responseType="token code"
									buttonText="Sign in with Google"
									onSuccess={this.responseGoogle}
									onFailure={this.onFailure}
									cookiePolicy={'single_host_origin'}
									prompt="consent"
								/>
							</div>
						</Grid>
					</Grid>
				</MuiThemeProvider>
			);
		}
	}
}

export default withRouter(Login);