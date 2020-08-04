import React, { Component } from 'react';
import { Button, Select, MenuItem, Container, Typography, FormControl, InputLabel, Grid, Paper, Tabs, Tab } from '@material-ui/core';
// import { isValidObjectId } from 'mongoose';

class Overview extends Component {
    constructor(props) {
        super(props);
        this.state = {
            className: '',
            selectedId: '',
            classList: [],
            assignmentList: [],
            sharedAssignments: [],
            sharedCourses: [],
            selectedPaperId: '',
            AvailableGroups: [],
            AvailableCourses: [],
            AvailableAssignments: [],
            AvailablePapers: [],
            rubrics: [], //TODO: CHECK THAT WE ACTUALLY USE THIS
            citations: [],
            tab: 0,
            group_id: ""
        };

        this.getGroups();
        this.getCourses();
        this.getRubrics();

        this.getGroups = this.getGroups.bind(this);
        this.getCourses = this.getCourses.bind(this);
        this.getAssignments = this.getAssignments.bind(this);
        this.getRubrics = this.getRubrics.bind(this);
        this.handleClassSelection = this.handleClassSelection.bind(this);
        this.handleGroupSelection = this.handleGroupSelection.bind(this);
        this.handleAssignmentSelection = this.handleAssignmentSelection.bind(this);
        this.handlePaperSelection = this.handlePaperSelection.bind(this);
        this.handleResultsChangeByPaper = this.handleResultsChangeByPaper.bind(this);
        this.handleResultsChangeByGroup = this.handleResultsChangeByGroup.bind(this);
        this.handleTabChange = this.handleTabChange.bind(this);
        this.TabPanel = this.TabPanel.bind(this);

    }

    getGroups() {
        let that = this;
        return (
            fetch('/api/groups/by_email/' + this.props.user.email)
                .then(response => {
                    return response.json();
                })
                .then(myJson => {
                    that.setState({ AvailableGroups: myJson });
                })
        );
    }


    getCourses() {
        let that = this;
        return (
            fetch('/api/courses/' + this.props.user.id)
                .then(response => {
                    return response.json();
                })
                .then(myJson => {
                    that.setState({ AvailableCourses: myJson });
                })
        );
    }



    getAssignments() {
        let that = this;
        return (
            fetch('/api/assignments/' + this.props.user.id)
                .then(response => {
                    return response.json();
                })
                .then(myJson => {
                    that.setState({ AvailableAssignments: myJson });
                })
        );
    }


    getRubrics() {
        let that = this;
        return (
            fetch('/api/rubrics/' + this.props.user.id)
                .then(response => {
                    return response.json();
                })
                .then(myJson => {
                    that.setState({ rubrics: myJson })
                })
        );
    }


    //Given a Group, this function makes a call to get all courses in that group.
    handleGroupSelection(event) {
        let target = event.target;
        this.setState({
            group_id: target.value
        });
    }

    //Given a Class, this function makes a call to get all assignments in that class.
    handleClassSelection(event) {
        
        let that = this;
        let target = event.target;
        fetch('/api/assignments/by_class_id/' + target.value)
            .then(response => {
                return response.json();
            })
            .then(myJson => {
                that.setState({ AvailableAssignments: myJson });
            });

    }

    handleAssignmentSelection(event) {
        event.preventDefault();
        let that = this;
        let target = event.target;
        fetch('/api/papers/by_ref_id/' + target.value)
            .then(function (response) {
                return response.json();
            })
            .then(function (myJson) {
                that.setState({ AvailablePapers: myJson });
            });
    }

    handlePaperSelection(event) {
        let that = this;
        let target = event.target;
        fetch('/api/citations/find_evaluations/' + target.value)
            .then(response => {
                return response.json();
            })
            .then(myJson => {
                that.setState({ paper_id: target.value, citations: myJson });
            });
    }

    handleResultsChangeByPaper(event) {
        event.preventDefault();
        this.props.updateOverviewPage(this.state.citations, null, 0);
    }

    handleResultsChangeByGroup(event) {
        event.preventDefault();

        let that = this;
        let target = event.target;
        //Query for classes belong to group, 
        // find all papers in found classes, 
        // then find all citations with author = "Overall Student Paper"

        fetch(`/api/assignments/by_group_id/${this.state.group_id}`)
            .then(response => {
                return response.json();
            })
            .then(myJson => {
                that.setState({ AvailableAssignments: myJson })
            });

        this.props.updateOverviewPage(this.state.AvailableAssignments, this.state.group_id, 1);
    }

    handleTabChange(event, newValue) {
        this.setState({ tab: newValue });
    }

    // from mat-ui
    a11yProps(index) {
        return {
            id: `overview-tab-${index}`,
            'aria-controls': `overview-tabpanel-${index}`,
        };
    }

    TabPanel(value, index, optionGroups, optionItems, optionAssignments, optionPapers) {

        return (
            <Grid item xs={12}>
                <div
                    role="tabpanel"
                    hidden={value !== index}
                    id={`overview-tabpanel-${index}`}
                    aria-labelledby={`overview-tab-${index}`}

                >
                    {value === index && (
                        <Grid item xs={12}>
                            <Grid
                                container
                                direction="row"
                                justify="center"
                                alignItems="center"
                            >
                                {index === 0 ?
                                    <Grid item >
                                        {/* View by paper */}


                                        <Typography align={"center"} variant={"subtitle1"} component={"p"} gutterBottom={true}>
                                            Please select the paper you want an overview for.
                                            </Typography>

                                        <form style={{ textAlign: "center", margin: "1em" }} onSubmit={this.handleResultsChangeByPaper}>
                                            <FormControl required={true} style={{ minWidth: 250 }}>
                                                <InputLabel id="selectClasslabelOverview">Select a Class</InputLabel>
                                                <Select
                                                    style={{ textAlign: "center" }}
                                                    labelId={"selectClasslabelOverview"}
                                                    defaultValue={""}
                                                    onChange={this.handleClassSelection}
                                                    inputProps={{
                                                        name: 'className',
                                                        id: 'assignForAnalyze',
                                                    }}
                                                >
                                                    <MenuItem value="" disabled >select class</MenuItem>
                                                    {optionItems}
                                                </Select>
                                            </FormControl>
                                            <br />
                                            <FormControl required={true} style={{ minWidth: 250 }}>
                                                <InputLabel id="selectAssignmentLabelOverview">Select an Assignment</InputLabel>
                                                <Select
                                                    style={{ textAlign: "center" }}
                                                    defaultValue={""}
                                                    onChange={this.handleAssignmentSelection}
                                                    inputProps={{
                                                        name: 'selectedAssignmentId',
                                                        id: 'assignForAnalyze',
                                                    }}
                                                >
                                                    <MenuItem value="" disabled> select assignment</MenuItem>
                                                    {optionAssignments}
                                                </Select>
                                            </FormControl>
                                            <br />
                                            <FormControl required={true} style={{ minWidth: 250, marginBottom: "1em" }}>
                                                <InputLabel id="selectAssignmentLabelOverview">Select a Paper</InputLabel>
                                                <Select
                                                    style={{ textAlign: "center" }}
                                                    onChange={this.handlePaperSelection}
                                                    defaultValue={""}
                                                    inputProps={{
                                                        name: 'selectedPaperId',
                                                        id: 'assignForAnalyze',
                                                    }}
                                                >
                                                    <MenuItem value="" disabled> select paper </MenuItem>
                                                    {optionPapers}
                                                </Select>
                                            </FormControl>
                                            <br />
                                            <Button variant={"contained"} color={'primary'} type={'submit'}>
                                                Show Evaluations
                                                </Button>
                                        </form>
                                    </Grid>
                                    :
                                    <Grid item>
                                        {/* View by group */}

                                        <Typography align={"center"} variant={"subtitle1"} component={"p"} gutterBottom={true}>
                                            Please select the group you want an overview for.
                                        </Typography>

                                        <form style={{ textAlign: "center", margin: "1em" }} onSubmit={this.handleResultsChangeByGroup}>
                                            <FormControl required={true} style={{ minWidth: 250 }}>
                                                <InputLabel id="selectGrouplabelOverview">Select a Group</InputLabel>
                                                <Select
                                                    style={{ textAlign: "center" }}
                                                    labelId={"selectGrouplabelOverview"}
                                                    defaultValue={""}
                                                    onChange={this.handleGroupSelection}
                                                    inputProps={{
                                                        name: 'groupName',
                                                        id: 'assignForAnalyze',
                                                    }}
                                                >
                                                    <MenuItem value="" disabled >select group</MenuItem>
                                                    {optionGroups}
                                                </Select>
                                            </FormControl>
                                            < br />
                                            <Button variant={"contained"} color={'primary'} type={'submit'}>
                                                Show Evaluations
                                                </Button>
                                        </form>
                                    </Grid>
                                }
                            </Grid>
                            {index === 0 ? true : false}
                        </Grid>

                    )}
                </div>
            </Grid>
        );
    }

    render() {

        let groups = this.state.AvailableGroups;
        let optionGroups = groups.map((group) =>
            <MenuItem value={group._id} key={group._id}> {group.name} </MenuItem>
        );

        let courses = this.state.AvailableCourses;
        let optionItems = courses.map((course) =>
            <MenuItem value={course._id} key={course._id}>{course.name}</MenuItem>
        );

        let assignments = this.state.assignmentList.concat(this.state.AvailableAssignments);
        let optionAssignments = assignments.map((assignment) =>
            <MenuItem value={assignment._id} key={assignment._id}>{assignment.name}</MenuItem>
        );

        let papers = this.state.AvailablePapers;
        let optionPapers = papers.map((paper) =>
            <MenuItem value={paper._id} key={paper._id}>{paper.title}</MenuItem>
        );


        return (
            <Container maxWidth={'md'}>

                <Typography style={{ marginTop: "1em" }} align={"center"} variant={"h3"} component={"h1"} gutterBottom={true}>
                    Overview
                </Typography>
                
                <Grid xs={12}>
                    <Paper square>
                        <Tabs
                            value={this.state.tab}
                            indicatorColor={"primary"}
                            textColor={"primary"}
                            onChange={this.handleTabChange}
                            aria-label={"by paper vs by groups"}
                            centered
                        >
                            <Tab label={"By Class"} {...this.a11yProps(0)} />
                            <Tab label={"By Group"} {...this.a11yProps(1)} />
                        </Tabs>
                    </Paper>
                </Grid>

                {this.TabPanel(this.state.tab, 0, optionGroups, optionItems, optionAssignments, optionPapers)}
                {this.TabPanel(this.state.tab, 1, optionGroups, optionItems, optionAssignments, optionPapers)}

            </Container>
        );
    }
}

export default Overview;