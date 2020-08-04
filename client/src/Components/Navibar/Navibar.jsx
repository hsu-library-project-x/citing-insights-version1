import React, { Component } from 'react';
import { AppBar, Toolbar, Typography, Button, Grid, Tooltip } from "@material-ui/core";
import { withRouter, Redirect } from 'react-router-dom';
import { GoogleLogout } from 'react-google-login';

import config from '../../config.json';
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";

import logo from "./logoCiting.svg";


class Navibar extends Component {
    constructor(props) {
        super(props);

        this.responseGoogle = this.responseGoogle.bind(this);
        this.onFailure = this.onFailure.bind(this);
    }


    responseGoogle = () => {
        fetch('/api/logout', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
        })
            .then(response => {
                if (response.status === 200 || response.ok) {
                    this.props.passInfoLogout();
                    return (
                        <Redirect to={{
                            pathname: '/login',
                            state: { from: this.props.location }
                        }} />
                    );
                }
                else {
                    alert("Error Logging out");
                }
            });

    };

    onFailure = (err) => {
        console.log(err);
    };

    render() {

        const theme = createMuiTheme({
            palette: {
                primary: { main: this.props.configurations.primaryColor }, // dk green
                secondary: { main: this.props.configurations.secondaryColor } // light green
            },
        });

        return (
            <MuiThemeProvider theme={theme}>
                <AppBar color='primary' position="static">
                    <Toolbar >
                        <Grid container spacing={1}>
                            <Grid item xs={5}>
                                <Typography variant="h4" component="h1" color="inherit" align='left' style={{ marginTop: '0.3em' }}  >
                                    {this.props.configurations.institutionName}
                                </Typography>
                            </Grid>
                            <Grid item xs={3}>
                                <img alt={'citing insights logo'} src={logo} />
                            </Grid>
                            <Grid item xs={3}></Grid>
                            <Grid item xs={1}>
                                {this.props.isAuthenticated ?
                                    <Tooltip title={this.props.isAuthenticated ? this.props.user.name : null} aria-label="username">
                                        <span>
                                            <GoogleLogout
                                                clientId={config.GOOGLE_CLIENT_ID}
                                                render={renderProps => (
                                                    <Button
                                                        className={"NavLinkButton"}
                                                        variant={"contained"}
                                                        disabled={renderProps.disabled}
                                                        onClick={this.responseGoogle}
                                                    >
                                                        Logout
                                                    </Button>
                                                )}
                                                responseType="code"
                                                buttonText="Log Out"
                                                onLogoutSuccess={this.responseGoogle}
                                                onFailure={this.onFailure}
                                            />
                                        </span>
                                    </Tooltip>
                                    : null
                                }
                            </Grid>
                        </Grid>
                    </Toolbar>
                </AppBar>
            </MuiThemeProvider>

        );
    }
}

export default withRouter(Navibar);
