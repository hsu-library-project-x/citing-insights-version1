import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import {Container,Typography, Button, FormControl, MenuItem, Select, InputLabel} from "@material-ui/core";

class AnalyzeSubMenu extends Component {

  constructor(props) {
    super(props);
    this.state = {
      className: '',
      selectedId: null,
      assignmentName: '',
      classList: [],
      assignmentList: [],
      sharedAssignments:[],
      sharedCourses:[],
      redirect: false,
      open: null,
    };

    this.getClasses();
    this.getAssignments();
    this.getSharedAssignments();
    this.getSharedCourses();

    this.getClasses = this.getClasses.bind(this);
    this.getAssignments = this.getAssignments.bind(this);
    this.getSharedAssignments = this.getSharedAssignments.bind(this);
    this.getSharedCourses = this.getSharedCourses.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

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


  handleInputChange(event) {

    const target = event.target;
    const value = target.value;
    const name = target.name;
    this.setState({
      [name]: value
    },
    );

  }


  async handleSubmit(event) {
    event.preventDefault();
    this.props.updateSelectedId(this.state.selectedId);
  }

  //In each render, map out Courses and Assignments into variables so we can place them in a drop down
  render() {

    let courses = this.state.classList.concat(this.state.sharedCourses);
    let optionItems = courses.map((course) =>
      <MenuItem value={course._id} key={course._id}>{course.name}</MenuItem>
    );

    let assignments = this.state.assignmentList.concat(this.state.sharedAssignments);
    let optionAssignments = assignments.map((assignment) =>
      <MenuItem value={assignment._id} key={assignment._id}>{assignment.name}</MenuItem>
    );

    return (
      <Container maxWidth={'md'}>

        <Typography style={{marginTop: "1em"}} align={"center"} variant={"h3"} component={"h1"} gutterBottom={true}>
          Analyze an Assignment
        </Typography>

        <form style={{textAlign:"center", margin:"1em"}} onSubmit={this.handleSubmit}>
          <FormControl  style={{minWidth: 250, marginBottom:"1em"}} disabled={this.state.open === 'assignment'}>
              <InputLabel id={"selectClasslabel"}>Select a Class</InputLabel>
              <Select
                  style={{textAlign:"center"}}
                  onOpen={()=>{this.setState({'open': 'class'})}}
                  onClose={()=>{this.setState({'open': null})}}
                  labelId={"selectClasslabel"}
                  onChange={this.handleInputChange}
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
                  onChange={this.handleInputChange}
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
            <br />
          <Button type="submit" color={"primary"} variant={"contained"} disabled={this.state.selectedId === null}> Submit </Button>
        </form>
      </Container>
    );
  }
}

export default withRouter(AnalyzeSubMenu);
