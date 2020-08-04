import React, { Component } from "react";
import {
    TextField,
    Modal,
    Paper,
    List,
    ListItem,
    Button,
    Typography,
    FormControl,
    Tooltip,
    IconButton,
    ListItemSecondaryAction, ListItemAvatar, Avatar, ListItemText, FormControlLabel, Checkbox
} from "@material-ui/core";
import AddIcon from '@material-ui/icons/Add';





class AddAssignment extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            groupName: '',
            creator: '',
            groupNote: '',
            members: [],
            newMembers: '',
            assignments:{},
        };

        this.handleOpen = this.handleOpen.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.getGroup = this.getGroup.bind(this);
        this.handleAlert = this.handleAlert.bind(this);
        this.getAssignments = this.getAssignments.bind(this);
        this.createCheckBox = this.createCheckBox.bind(this);


        this.getGroup();
        this.getAssignments();

    }

    createCheckBox(){
        let boxes = [];

        for( let i=0; i<Object.keys(this.state.assignments).length; i++){
            boxes.push(<p> {this.state.assignments[i].name}</p>);
        }


        return boxes;

    }

    getAssignments() {
        fetch('/api/assignments/by_user_id/' + this.props.user.id)
            .then(function (response) {
                return response.json();
            }).then(allAssignments => this.setState({assignments:allAssignments}));
    }

    handleAlert(message, severity) {
        this.props.handleQueueAlert(message, severity);
    }

    handleOpen = () => {
        this.setState({ open: true });
    };

    handleClose = () => {
        this.setState({ open: false });
    };

    //call when input changes to update the state
    handleInputChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        this.setState({
            [name]: value
        });
    }


    getGroup() {
        let that = this;
        let id = this.props.id;
        fetch('/api/groups/' + id).then(function (response) {
            return response.json();
        })
            .then(function (myJson) {
                that.setState({
                    groupName: myJson.name,
                    creator: myJson.creator,
                    groupNote: myJson.note,
                    members: myJson.members
                });
            });
    }

    render() {
        return (
            <span>
                <Tooltip title="Add Assignment for Group" aria-label="add assignment for group">
                    <IconButton edge="end"
                                aria-label="addAssignment"
                                onClick={this.handleOpen}
                    >
                        <AddIcon />
                    </IconButton>
                </Tooltip>
                <Modal
                    aria-labelledby="add-assignmnet-modal"
                    open={this.state.open}
                    onClose={this.handleClose}
                    closeAfterTransition={true}
                    style={{ marginTop: '5%', width: '50%', marginRight: 'auto', marginLeft: 'auto' }}
                >
                    <Paper>
                        <Typography style={{ paddingTop: "1em" }} align={"center"} variant={"h4"}
                                    component={"h2"} gutterBottom={true}> Add Assignment for Group Evaluation   </Typography>
                        <FormControl>
                            {this.createCheckBox()}
                        {/*<form className={'modal_form'} onSubmit={(e) => {*/}
                        {/*    e.preventDefault();*/}
                        {/*    */}
                        {/*  */}
                        {/*        let group = {*/}
                        {/*            id: this.props.id,*/}
                        {/*            name: this.state.groupName,*/}
                        {/*            creator: this.state.creator,*/}
                        {/*            note: this.state.groupNote,*/}
                        {/*        };*/}

                        {/*        let body = JSON.stringify(group);*/}


                        {/*        fetch("/api/groups/update/", {*/}
                        {/*            method: "PUT",*/}
                        {/*            body: body,*/}
                        {/*            headers: {*/}
                        {/*                "Accept": "application/json",*/}
                        {/*                "Content-Type": "application/json"*/}
                        {/*            }*/}
                        {/*        })*/}
                        {/*            .then((response) => {*/}
                        {/*                if (response.status === 201) {*/}
                        {/*                    this.handleAlert("Group details updated", "success");*/}
                        {/*                }*/}
                        {/*                else {*/}
                        {/*                    this.handleAlert("Unable to update group, please try again", "error");*/}
                        {/*                }*/}
                        {/*                this.handleClose();*/}
                        {/*                this.getGroup();*/}
                        {/*            });*/}
                        {/*    }*/}


                        {/*}}>*/}

                                <Button variant="contained" type="submit" color="primary"> Submit </Button>
                            </FormControl>
                        {/*</form>*/}
                    </Paper>
                </Modal>
            </span >
        );
    }
}
export default (AddAssignment);
