import React, { Component } from "react";
import {
    TextField, Modal, Paper, Fab, Button, Typography, Select, FormControl,
    MenuItem, InputLabel
} from "@material-ui/core";
import { withRouter } from "react-router-dom";


class RequestGroup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            AvailableGroups: [],
            GroupId: '',
            Message: '',
            Name: "",
        };

        this.getGroups();

        this.getGroups = this.getGroups.bind(this);
        this.handleOpen = this.handleOpen.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleAlert = this.handleAlert.bind(this);
    }

    handleAlert(message, severity) {
        this.props.handleQueueAlert(message, severity);
    }

    getGroups() {
        let that = this;
        fetch('/api/groups/').then(function (response) {
            return response.json();
        })
            .then(function (myJson) {
                that.setState({ AvailableGroups: myJson })
            });
    }

    handleOpen = () => {
        this.getGroups();
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

    render() {

        let groupList = this.state.AvailableGroups;
        let requestGroups = [];
        for (let x = 0; x < groupList.length; x++) {
            if (groupList[x].creator !== this.props.user.email) {
                requestGroups.push(groupList[x]);
            };
        };
        let optionGroups = requestGroups.map((group) => 
            <MenuItem value={group._id} key={group._id}> {group.name}</MenuItem>
        );
        return (
            <div>
                <Fab type="button"
                    variant="extended"
                    color={'primary'}
                    onClick={this.handleOpen}
                    size={"small"}
                    style={{ margin: "1em" }}
                >
                    Request Group
                </Fab>
                <Modal
                    aria-labelledby="request-group-modal"
                    open={this.state.open}
                    onClose={this.handleClose}
                    closeAfterTransition={true}
                    style={{marginTop:'5%', width:'50%', marginRight:'auto', marginLeft:'auto', overflow: 'auto'}}
                >
                    <Paper>
                        <Typography style={{ paddingTop: "1em" }} align={"center"} variant={"h4"} component={"h2"}
                            gutterBottom={true}>
                            Request Group
                        </Typography>
                        <form className={'modal_form'} onSubmit={(event) => {
                            event.preventDefault();

                            let creatorCheck = false,
                                pendingCheck = false,
                                memberCheck = false;

                            for (var i = 0; i < groupList.length; i++) {

                                //Check to see if the user is the creator of group

                                if (groupList[i].creator === this.props.user.email &&
                                    groupList[i]._id === this.state.GroupId) {
                                    creatorCheck = true;
                                    this.handleAlert("Can't request to join group; You are the creator.", "error");
                                    this.handleClose();
                                    break;
                                }

                                //Check to see if user is already a pending member
                                if (groupList[i].pendingMembers !== undefined) {
                                    for (var j = 0; j < groupList[i].pendingMembers.length; j++) {
                                        if (groupList[i].pendingMembers[j] === this.props.user.email) {
                                            pendingCheck = true;
                                            this.handleAlert("You have already requested to join this group.", "error");
                                            this.handleClose();
                                            break;
                                        }
                                    }
                                }

                                //check to see if user is already in members
                                if (groupList[i].members !== undefined) {
                                    for (var k = 0; k < groupList[i].members.length; k++) {

                                        if (groupList[i].members[k] === this.props.user.email) {
                                            memberCheck = true;
                                            this.handleAlert("You are already a member of this group.", "error");
                                            this.handleClose();
                                            break;
                                        }
                                    }
                                }
                            }

                            if (!creatorCheck && !pendingCheck && !memberCheck) {
                                let pending_member = {
                                    id: this.state.GroupId,
                                    email: this.props.user.email,
                                    message: this.state.Message,
                                    name: this.state.Name
                                };

                                let json = JSON.stringify(pending_member);

                                fetch("/api/groups/pendingAdd", {
                                    method: "PUT",
                                    body: json,
                                    headers: {
                                        'Accept': 'application/json',
                                        'Content-Type': 'application/json'
                                    }
                                })
                                    .then((response) => {
                                        if (response.status === 201) {
                                            this.handleAlert("Request to join sent to group's administrator", "success");
                                        }
                                        this.handleClose();
                                    })
                            }


                        }}>
                            <FormControl >
                                <InputLabel id="groupSelect-label">Select a Group</InputLabel>
                                <Select
                                    name="GroupId"
                                    required
                                    labelId={"groupSelect-label"}
                                    onChange={this.handleInputChange}
                                    value={this.state.GroupId}
                                    style={{ minWidth: 150 }}
                                >
                                    <MenuItem value={""} disabled> Select a Group</MenuItem>
                                    {optionGroups}
                                </Select>
                                <br />

                                <TextField
                                    name="Name"
                                    label={"Name"}
                                    onChange={this.handleInputChange}
                                    style={{ marginBottom: "1em" }} />

                                <TextField
                                    name="Message"
                                    label={"Message (optional)"}
                                    onChange={this.handleInputChange}
                                    multiline
                                    rowsMax="4"
                                    style={{ marginBottom: "1em" }} />

                                <Button variant="contained" type="submit" color="primary"> Submit </Button>
                            </FormControl>
                        </form>
                    </Paper>
                </Modal >
            </div >
        );
    }
}

export default withRouter(RequestGroup);