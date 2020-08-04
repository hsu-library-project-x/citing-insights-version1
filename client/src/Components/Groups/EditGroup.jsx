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
    ListItemSecondaryAction, ListItemAvatar, Avatar, ListItemText
} from "@material-ui/core";
import { withRouter } from "react-router-dom";
import EditIcon from "@material-ui/icons/Edit";
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import DeleteIcon from "@material-ui/icons/Delete";
import Papa from "papaparse";


class EditGroup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            groupName: '',
            creator: '',
            groupNote: '',
            members: [],
            newMembers: ''
        };

        this.handleOpen = this.handleOpen.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.getGroup = this.getGroup.bind(this);
        this.handleAlert = this.handleAlert.bind(this);
        this.handleValidation = this.handleValidation.bind(this);

        this.getGroup();
    }


    handleAlert(message, severity) {
        this.props.handleQueueAlert(message, severity);
    }

    handleOpen = () => {
        this.getGroup();
        this.setState({ open: true });
    };

    handleClose = () => {
        this.setState({
            open: false,
            groupName: '',
            creator: '',
            groupNote: '',
            members: [],
            newMembers: ''
        });
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

    handleValidation = (members) => {

        //Need to delimit CSV, and validate emails
        const expression = /(?!.*\.{2})^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([ \t]*\r\n)?[ \t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([ \t]*\r\n)?[ \t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;

        let valid = true;
        let invalid_email = "";

        //Validate each email
        for (let i = 0; i < members.length; i++) {
            if (expression.test(String(members[i]).toLowerCase()) === false ||
                members[i][0] === this.props.user.email) {
                valid = false;
                invalid_email = members[i][0];
            }
        }

        if (valid) {
            return "true";
        }
        else {
            return invalid_email;
        }
    };

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
                <Tooltip title="Edit Group" aria-label="edit group">
                    <IconButton edge="end"
                        aria-label="edit"
                        onClick={this.handleOpen}
                    >
                        <EditIcon />
                    </IconButton>
                </Tooltip>
                <Modal
                    aria-labelledby="edit-group-modal"
                    open={this.state.open}
                    onClose={this.handleClose}
                    closeAfterTransition={true}
                    style={{marginTop:'5%', width:'50%', marginRight:'auto', marginLeft:'auto', overflow: 'auto'}}
                >
                    <Paper>
                        <Typography style={{ paddingTop: "1em" }} align={"center"} variant={"h4"}
                            component={"h2"} gutterBottom={true}> Edit Group   </Typography>
                        <form className={'modal_form'} onSubmit={(e) => {
                            e.preventDefault();

                            let member_array_parsed = Papa.parse(this.state.newMembers).data;


                            let validationCheck = this.handleValidation(member_array_parsed);
                            if (validationCheck === this.props.user.email) {
                                this.handleAlert('Cannot add yourself as a member to a group you own', 'error');
                            }
                            else if (validationCheck !== "true") {
                                this.handleAlert(validationCheck + ' is not a valid email. Please try again.', 'error');
                            }
                            else {

                                for (let l = 0; l < member_array_parsed.length; l++) {
                                    if (member_array_parsed[l][0] !== this.state.creator) {
                                        this.state.members.push(member_array_parsed[l][0]);
                                    }
                                    else {
                                        this.handleAlert("Group owner cannot be a group member", "error");
                                    }

                                }

                                let group = {
                                    id: this.props.id,
                                    name: this.state.groupName,
                                    creator: this.state.creator,
                                    note: this.state.groupNote,
                                    members: this.state.members
                                };

                                let body = JSON.stringify(group);


                                fetch("/api/groups/update/", {
                                    method: "PUT",
                                    body: body,
                                    headers: {
                                        "Accept": "application/json",
                                        "Content-Type": "application/json"
                                    }
                                })
                                    .then((response) => {
                                        if (response.status === 201) {
                                            this.handleAlert("Group details updated", "success");
                                        }
                                        else {
                                            this.handleAlert("Unable to update group, please try again", "error");
                                        }
                                        this.handleClose();
                                        this.getGroup();
                                    });
                            }


                        }}>
                            <FormControl>
                                <TextField
                                    label={'Group Name'}
                                    onChange={this.handleInputChange}
                                    name="groupName"
                                    value={this.state.groupName}
                                    required
                                    style={{ marginBottom: "1em" }} />
                                <br />
                                <TextField
                                    onChange={this.handleInputChange}
                                    name="creator"
                                    value={this.state.creator}
                                    label={"Current Owner"}
                                    style={{ marginBottom: "1em" }} />
                                <br />
                                <TextField
                                    onChange={this.handleInputChange}
                                    name="groupNote"
                                    value={this.state.groupNote}
                                    label={"Current Description"}
                                    multiline
                                    rowsMax="4"
                                    style={{ marginBottom: "1em" }} />
                                <br />

                                <List component={"div"}
                                >
                                    {this.state.members !== undefined ?
                                        this.state.members.map((member) => {
                                            return (
                                                <ListItem>
                                                    <ListItemAvatar>
                                                        <Avatar>
                                                            <AccountCircleIcon />
                                                        </Avatar>
                                                    </ListItemAvatar>
                                                    <ListItemText
                                                        primary={member}
                                                    />
                                                    <ListItemSecondaryAction>
                                                        <Tooltip title="Remove Member" aria-label="remove member">
                                                            <IconButton edge="end"
                                                                aria-label="remove"
                                                                onClick={e => {
                                                                    let body = {
                                                                        id: this.props.id,
                                                                        member: member
                                                                    };

                                                                    let json = JSON.stringify(body);

                                                                    fetch("/api/groups/removeMember", {
                                                                        method: "PUT",
                                                                        body: json,
                                                                        headers: {
                                                                            'Accept': 'application/json',
                                                                            'Content-Type': 'application/json'
                                                                        }
                                                                    })
                                                                        .then((response) => {
                                                                            if (response.status === 201) {
                                                                                this.handleAlert("Member successfully removed from group.", "success");
                                                                            }
                                                                            this.handleClose();
                                                                            this.getGroup();
                                                                        });

                                                                }}
                                                            >
                                                                <DeleteIcon />
                                                            </IconButton>
                                                        </Tooltip>
                                                    </ListItemSecondaryAction>
                                                </ListItem>
                                            );
                                        }) : null}
                                </List>
                                <TextField
                                    label="Add Member (by Emails)"
                                    name="newMembers"
                                    value={this.state.newMembers}
                                    onChange={this.handleInputChange}
                                    multiline
                                    rows={4}
                                    variant="outlined"
                                />
                                <br />
                                <Button variant="contained" type="submit" color="primary"> Submit </Button>
                            </FormControl>
                        </form>
                    </Paper>
                </Modal>
            </span >
        );
    }
}
export default (EditGroup);
