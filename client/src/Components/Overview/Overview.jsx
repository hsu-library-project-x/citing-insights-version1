import React, { Component } from 'react';
import { Button, Select, MenuItem, Container, Typography, FormControl, InputLabel, Grid, Paper, Tabs, Tab } from '@material-ui/core';
// import { isValidObjectId } from 'mongoose';

class Overview extends Component {
    constructor(props) {
        super(props);
        this.state = {
            className: '',
            selectedId: null,
            classList: [],
            assignmentList: [],
            sharedAssignments: [],
            AvailableAssignments: [],
            sharedCourses: [],
            selectedPaperId: '',
            AvailableGroups: [],
            classList: [],
            assignmentList: [],
            AvailablePapers: [],
            rubrics: [], //TODO: CHECK THAT WE ACTUALLY USE THIS
            citations: [],
            tab: 0,
            group_id: "",
            open: null,
        };

        this.getGroups();
        this.getRubrics();
        this.getClasses();
        this.getAssignments();
        this.getSharedAssignments();
        this.getSharedCourses();

        this.getGroups = this.getGroups.bind(this);
        this.getClasses = this.getClasses.bind(this);
        this.getAssignments = this.getAssignments.bind(this);
        this.getRubrics = this.getRubrics.bind(this);
        this.getSharedAssignments = this.getSharedAssignments.bind(this);
        this.getSharedCourses = this.getSharedCourses.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleGroupSelection = this.handleGroupSelection.bind(this);
        this.handleAssignmentOrClassSelection = this.handleAssignmentOrClassSelection.bind(this);
        this.handlePaperSelection = this.handlePaperSelection.bind(this);
        this.handleResultsChangeByPaper = this.handleResultsChangeByPaper.bind(this);
        this.handleResultsChangeByGroup = this.handleResultsChangeByGroup.bind(this);
        this.handleTabChange = this.handleTabChange.bind(this);
        this.TabPanel = this.TabPanel.bind(this);

    }

    handleInputChange(event) {

        const target = event.target;
        const value = target.value;
        const name = target.name;
        this.setState({
          [name]: value
        },
        );
    
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

    createTreeItems(json, state) {
        let list = [];
        if(json !== undefined){
            if(state === 'myGroups'){
                for (let i = 0; i < json.length; i++) {
                    list.push(json[i]["_id"]);
                }
            }else{
                for (let i = 0; i < json.length; i++) {
                    list.push(json[i]);
                }
            }
      
            this.setState({ [state]: list });
        }
      }

    //Given a Group, this function makes a call to get all courses in that group.
    handleGroupSelection(event) {
        let target = event.target;
        this.setState({
            group_id: target.value
        });
    }

    handleAssignmentOrClassSelection(event) {
        event.preventDefault();
        let that = this;

        const target = event.target;
        const value = target.value;
        const name = target.name;
        this.setState({
          [name]: value
        }, () => {
            fetch('/api/papers/by_ref_id/' + this.state.selectedId)
            .then(function (response) {
                return response.json();
            })
            .then(function (myJson) {
            
                that.setState({ AvailablePapers: myJson });
            });
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
                                            
                                            
                                        <FormControl  style={{minWidth: 250, marginBottom:"1em"}} disabled={this.state.open === 'assignment'}>
                                            <InputLabel id={"selectClasslabel"}>Select a Class</InputLabel>
                                            <Select
                                                style={{textAlign:"center"}}
                                                onOpen={()=>{this.setState({'open': 'class'})}}
                                                onClose={()=>{this.setState({'open': null})}}
                                                labelId={"selectClasslabel"}
                                                onChange={this.handleAssignmentOrClassSelection}
                                                defaultValue={""}
                                                value={this.state.selectedId}
                                                inputProps={{
                                                    name: 'selectedId',
                                                }}
                                            >
                                                <MenuItem value="" disabled >select class</MenuItem>
                                                {optionItems}
                                            </Select>
                                        </FormControl>
                                            <br /> <p> OR </p>
                                        <FormControl  style={{minWidth: 250, marginBottom:"1em"}} disabled={this.state.open === 'class'}>
                                            <InputLabel id={'selectAssignmentlabel'}>Select an Assignment </InputLabel>
                                            <Select
                                                style={{textAlign:"center"}}
                                                onOpen={()=>{this.setState({'open': 'assignment'})}}
                                                onClose={()=>{this.setState({'open': null})}}
                                                labelId={"selectAssignmentlabel"}
                                                onChange={this.handleAssignmentOrClassSelection}
                                                defaultValue={""}
                                                value={this.state.selectedId}
                                                inputProps={{
                                                    name: 'selectedId',
                                                }}
                                            >
                                                <MenuItem value="" disabled >select an assignment </MenuItem>
                                                {optionAssignments}
                                            </Select>
                                        </FormControl>

                                            <br /> <p> Then </p>
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
                                            <Button type="submit" color={"primary"} variant={"contained"} disabled={this.state.selectedId === null}>
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
                                            <FormControl required={true} style={{ minWidth: 250, marginBottom: "1em"}}>
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

        let courses = this.state.classList.concat(this.state.sharedCourses);
        let optionItems = courses.map((course) =>
          <MenuItem value={course._id} key={course._id}>{course.name}</MenuItem>
        );
    
        let assignments = this.state.assignmentList.concat(this.state.sharedAssignments);
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
                            <Tab label={"By Paper"} {...this.a11yProps(0)} />
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