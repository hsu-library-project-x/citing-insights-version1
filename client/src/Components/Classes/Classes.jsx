import React, { Component } from 'react';
import {
    Container, Typography, Snackbar, Grid, Paper, Tabs, Tab, AppBar, Box
} from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import { withRouter } from 'react-router-dom';

import CreateClass from "./CreateClass";
import CreateAssignment from "./CreateAssignment";
import CreateList from "./CreateList";
import CreateSharedList from "./CreateSharedList";


class Classes extends Component {
    constructor(props) {
        super(props);
        this.state = {
            classList: [],
            assignmentList: [],
            availableGroups:[], // all of the groups in database
            myGroups: [], //groups that user is a creator or member of
            sharedAssignments:[],
            sharedCourses:[],
            loading:true, // currently not used
            messageInfo: undefined,
            snackbarOpen:false, //we get away with only one snackbar vairable because mat-ui only allows one snackbar to be open
            tab: 0,
        };

        this.getClasses();
        this.getAssignments();
        this.getGroups();
        this.getSharedGroups();
        this.getSharedAssignments();
        this.getSharedCourses();

       
        this.getClasses = this.getClasses.bind(this);
        this.getAssignments = this.getAssignments.bind(this);
        this.getSharedAssignments = this.getSharedAssignments.bind(this);
        this.getSharedCourses = this.getSharedCourses.bind(this);

        this.createTreeItems = this.createTreeItems.bind(this);
        this.processQueue = this.processQueue.bind(this);
        this.handleQueueAlert = this.handleQueueAlert.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleExited = this.handleExited.bind(this);
        this.handleTabChange = this.handleTabChange.bind(this);

        this.queueRef = React.createRef();
        this.queueRef.current = [];
    }

    getClasses() {
        fetch('/api/courses/' + this.props.user.id)
            .then(function (response) {
                return response.json();
            })
            .then(d => this.createTreeItems(d, 'classList'));
    }

    getAssignments() {
        fetch('/api/assignments/by_user_id/' + this.props.user.id)
            .then(function (response) {
                return response.json();
            })
            .then(d => {
                this.createTreeItems(d, 'assignmentList');
            });
    }

    getGroups() {
        fetch('/api/groups/').then(function (response) {
            return response.json();
        })
        .then(d => {
            this.createTreeItems(d, 'availableGroups');
        });

    }

    getSharedGroups(){
        fetch(`/api/groups/by_email/${this.props.user.email}/`).then(function (response) {
                return response.json();
        }).then(d => {
            this.createTreeItems(d, 'myGroups');
        });
    }

    getSharedAssignments(){
        fetch(`/api/assignments/by_email_and_ID/${this.props.user.email}/${this.props.user.id}`,).then(function (response) {
            if(response.status === 201){
                return response.json();
            }
        }).then(d => {
            this.createTreeItems(d, 'sharedAssignments');
        });
    }

    getSharedCourses(){

        fetch(`/api/courses/by_email_and_ID/${this.props.user.email}/${this.props.user.id}`).then(function (response) {

            if(response.status === 201){
               
                return response.json();
            }

        }).then(d => {
            this.createTreeItems(d, 'sharedCourses');
        });
    }


    createTreeItems(json, state) {
        let list = [];
        if(json !== undefined){
            // if(state === 'myGroups'){
            //     for (let i = 0; i < json.length; i++) {
            //         list.push(json[i]["_id"]);
            //     }
            // }else{
                for (let i = 0; i < json.length; i++) {
                    list.push(json[i]);
                }
            // }

            this.setState({ [state]: list });
        }
     
    }

    processQueue(){
        if(this.queueRef.current.length >0){
            this.setState({
                messageInfo: this.queueRef.current.shift(),
                snackbarOpen:true}
            );
        }
    };

    handleQueueAlert(message, severity){
        this.queueRef.current.push({
            message: message,
            severity:severity,
            key: new Date().getTime(),
        });
        if(this.state.snackbarOpen){
            this.setState({snackbarOpen:false});
        }else{
            this.processQueue();
        }
        this.getClasses();
        this.getAssignments();
    };

    handleClose(event, reason){
        if(reason === 'clickaway'){
            return;
        }
        this.setState({snackbarOpen:false});
    };

    handleExited(){
        this.processQueue();
    };

    handleTabChange(event, newValue){
        this.setState({tab: newValue});
    }

    DisplayAlerts(){
        return <Snackbar
            key={this.state.messageInfo ? this.state.messageInfo.key : undefined}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            open={this.state.snackbarOpen}
            autoHideDuration={3000}
            onClose={this.handleClose}
            onExited={this.handleExited}
        >
            <Alert variant={'filled'}
                   severity={this.state.messageInfo ? this.state.messageInfo.severity : undefined}
                   onClose={this.handleClose}
            >
                {this.state.messageInfo ? this.state.messageInfo.message : undefined}
            </Alert>
        </Snackbar>
    }

    // from mat-ui
     a11yProps(index) {
        return {
            id: `simple-tab-${index}`,
            'aria-controls': `simple-tabpanel-${index}`,
        };
    }

     TabPanel(value, index){
        return (
            <Grid item xs={12}>
            <div
                role="tabpanel"
                hidden={value !== index}
                id={`simple-tabpanel-${index}`}
                aria-labelledby={`simple-tab-${index}`}
            >
                {value === index && (
                    <Grid item xs={12}>
                        <Grid
                            container
                            direction="row"
                            justify="flex-end"
                            alignItems="flex-end"
                        >
                            {index === 0 ?
                            <Grid item >
                                <CreateClass
                                    user_id={this.props.user.id}
                                    handleQueueAlert={this.handleQueueAlert}
                                />
                            </Grid> : null}
                            {index === 0 ?
                            <Grid item>
                                <CreateAssignment
                                    user_id={this.props.user.id}
                                    classList={this.state.classList}
                                    handleQueueAlert={this.handleQueueAlert}
                                />
                            </Grid> : null}
                        </Grid>
                    {/*</Grid>*/}
                    {/*    <Grid xs={12}>*/}
                    {index === 0 ?
                        <CreateList
                            classList={this.state.classList}
                            assignmentList={this.state.assignmentList}
                            availableGroups={this.state.myGroups}
                            handleQueueAlert={this.handleQueueAlert}
                            user_id={this.props.user.id}
                            user_email={this.props.user.email}
                        /> :
                        <CreateSharedList 
                            sharedClassList={this.state.sharedCourses}
                            assignmentList={this.state.sharedAssignments}
                            handleQueueAlert={this.handleQueueAlert}
                            user_id={this.props.user.id}
                        />    
                    }
                    </Grid>

                )}
            </div>
            </Grid>
        );
    }



    render() {

        return (
            <Container maxWidth={"md"}>
                {this.DisplayAlerts()}
                <Grid
                    container
                    direction="row"
                    justify="space-evenly"
                    alignItems="center"
                >
                    <Grid item xs={12}>
                        <Typography style={{ marginTop: "1em" }} align={"center"} variant={"h3"} component={"h1"} gutterBottom={true}>
                            Manage Coursework
                        </Typography>
                    </Grid>

                    <Grid xs={12}>
                        <Paper square>
                            <Tabs
                                value={this.state.tab}
                                indicatorColor={"primary"}
                                textColor={"primary"}
                                onChange={this.handleTabChange}
                                aria-label={"my courses vs shared courses"}
                                centered
                            >
                                <Tab label={"My Coursework"} {...this.a11yProps(0)} />
                                <Tab label={"Shared Coursework"} {...this.a11yProps(1)} />
                            </Tabs>
                        </Paper>
                    </Grid>

                    {this.TabPanel(this.state.tab, 0)}
                    {this.TabPanel(this.state.tab, 1)}

                </Grid>
            </Container>
        );
    }
}

export default withRouter(Classes);