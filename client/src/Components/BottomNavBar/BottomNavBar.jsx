import React, { Component } from 'react';
import {Toolbar, Modal, Button, AppBar,Container, Card,CardContent, Typography} from "@material-ui/core";
import {createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import InfoIcon from '@material-ui/icons/Info';
import ContactMailIcon from '@material-ui/icons/ContactMail';
import EmailIcon from '@material-ui/icons/Email';
import {withRouter} from "react-router-dom";

class BottomNavBar extends Component {
    constructor(props) {
        super(props);
        this.state={
            value:null,
            aboutOpen: false,
            contactOpen: false,
        };

        this.handleAboutOpen = this.handleAboutOpen.bind(this);
        this.handleContactOpen = this.handleContactOpen.bind(this);
        this.handleContactClose = this.handleContactClose.bind(this);
        this.handleAboutClose = this.handleAboutClose.bind(this);
        this.aboutModal = this.aboutModal.bind(this);
        this.contactModal = this.contactModal.bind(this);
    }
     handleAboutOpen = () => {
        this.setState({aboutOpen:true});
    };

    handleContactOpen = () => {
        this.setState({contactOpen:true});
    };

     handleAboutClose = () => {
         this.setState({aboutOpen:false});
    };

    handleContactClose = () => {
        this.setState({contactOpen:false});
    };

    aboutModal =() => {
        return(
            <Container maxWidth={'sm'}>
                <Card style={{margin:"1em"}}  variant="outlined">
                    <CardContent>
                        <Typography style={{margin:"0.5em"}} align='center' variant={"h4"} component={"h2"}> Citing Insights About Us </Typography>
                        <Typography component={"p"}>
                            Citing Insights was developed by undergraduate students working at HSU Library,
                            this powerful tool streamlines assessment of students' information literacy and
                            other skills. The project began in the spring of 2019, Cindy Batres, Elizabeth Lujan,
                            Ben Miller, Kyle Smith, and Mitchell Waters, the Citing Insights Team, working with
                            Cyril Oberlander, Library Dean, developed this open source software to automate some
                            of the assessment work with student papers. Beta release March 2020 and full release
                            May 2020. With Citing Insights, you can upload a student paper, all the citations are
                            detected and discovery of the sources are made easy. With Citing Insights, you can
                            leverage and/or edit AAC&U Information Literacy and other assessment rubrics to the
                            student papers, and annotate, providing students with feedback, or providing accrediting
                            bodies with detailed reports. Citing Insights was developed by students working at
                            Humboldt State University Library, thanks to funding from CSU Graduation Initiative 2025.
                        </Typography>
                    </CardContent>
                </Card>
            </Container>
        );
    };

    contactModal = () => {
        return(
            <Container maxWidth={'sm'}>
                <Card style={{margin:"1em"}}  variant="outlined">
                    <Typography style={{margin:"1em"}} variant={"h4"} component={"h2"}> Contact Us </Typography>
                    <Typography style={{margin:"1em"}} component={"p"}>
                        <EmailIcon  style={{margin:"1em"}} color={"primary"}/>
                        citing-insights-dev-team@humboldt.edu
                    </Typography>
                    <Typography  style={{margin:"1em", textAlign:"center"}} component={"p"} color="textSecondary" >
                        Thank you for your interest in this project! We look forward to hearing from you!
                    </Typography>
                </Card>
            </Container>
        );
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
                    <AppBar color='primary' position="static" style={{bottom:0 , top:'auto'}}>
                        <Toolbar>
                                <Button
                                    onClick={this.handleAboutOpen}
                                    style={{margin: '0 auto'}}
                                    size="small"
                                    variant={"contained"}
                                    startIcon={<InfoIcon color={"secondary"}/>}>
                                        About Us
                                </Button>
                                    <Modal
                                        aria-labelledby="About Us"
                                        aria-describedby="Learn about the Citing Insights Team / Project"
                                        open={this.state.aboutOpen}
                                        onClose={this.handleAboutClose}
                                    >
                                        {this.aboutModal()}
                                    </Modal>
                                <Button
                                    onClick={this.handleContactOpen}
                                    style={{margin: '0 auto'}}
                                    size="small"
                                    variant={"contained"}
                                    startIcon={<ContactMailIcon color={"secondary"}/>} >
                                        Contact Us
                                </Button>
                                    <Modal
                                        aria-labelledby="Contact Us"
                                        aria-describedby="Contact the Citing Insights Team / Project"
                                        open={this.state.contactOpen}
                                        onClose={this.handleContactClose}
                                    >
                                        {this.contactModal()}
                                    </Modal>
                        </Toolbar>
                    </AppBar>
            </MuiThemeProvider>

        );
    }
}

export default withRouter(BottomNavBar);