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
    ListItemSecondaryAction, ListItemAvatar, Avatar, ListItemText, Badge
} from "@material-ui/core";


import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import ClearIcon from '@material-ui/icons/Clear';
import AddAlertIcon from "@material-ui/icons/AddAlert";
import CheckIcon from '@material-ui/icons/Check';


class JoinRequests extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            pending: [],
            Members: [],
        };

        this.handleOpen = this.handleOpen.bind(this);
        this.handleClose = this.handleClose.bind(this);

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


    render() {
        return (
            <span>
                 <Tooltip title="Join Requests" aria-label="requests to join group">
                        <IconButton edge="end"
                                    aria-label="notification"
                                    onClick={e => this.handleOpen(e, this.props.id)}

                        >
                            {/*If pending.length is 0 then badge simply won't appear*/}
                            <Badge  color='primary' badgeContent={this.props.pendingMembers.length}>
                                <AddAlertIcon />
                            </Badge>
                        </IconButton>


                </Tooltip>

                <Modal
                    aria-labelledby="join-group-modal"
                    open={this.state.open}
                    onClose={this.handleClose}
                    closeAfterTransition={true}
                    style={{marginTop:'5%', width:'50%', marginRight:'auto', marginLeft:'auto', overflow: 'auto'}}
                >
                    <Paper>
                        <Typography style={{ paddingTop: "1em" }} align={"center"} variant={"h4"}
                            component={"h2"} gutterBottom={true}> Join Requests   </Typography>
                        <form className={'modal_form'} >

                            <List>
                                {this.props.pendingMembers.map((member) => {
                                    let message = '';
                                    if (member.name !== "") {
                                        message = `${member.name} - ${member.message}`;
                                    }
                                    else {
                                        message = member.message;
                                    }
                                    
                                    return (
                                        <ListItem>
                                            <ListItemAvatar>
                                                <Avatar>
                                                    <AccountCircleIcon />
                                                </Avatar>
                                            </ListItemAvatar>
                                            <ListItemText
                                                primary={member.email}
                                                secondary={message}
                                            />
                                            <ListItemSecondaryAction>
                                                <Tooltip title="Add Member" aria-label="add member">
                                                    <IconButton edge="end"
                                                        aria-label="add"
                                                        onClick={e => {
                                                            let body = {
                                                                groupId: this.props.id,
                                                                pendingEmail: member.email,
                                                                pendingId: member._id
                                                            };
                                                            let json = JSON.stringify(body);

                                                            fetch("/api/groups/pendingAccept/", {
                                                                method: "PUT",
                                                                body: json,
                                                                headers: {
                                                                    'Accept': 'application/json',
                                                                    'Content-Type': 'application/json'
                                                                }
                                                            })
                                                                .then((response) => {
                                                                    if (response.status === 201) {
                                                                        this.handleAlert("Member successfully added to group.", "success");
                                                                    }
                                                                    this.handleClose();
                                                                    this.props.getGroups();
                                                                });
                                                        }}>

                                                        <CheckIcon />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Reject Member" aria-label="reject member">
                                                    <IconButton edge="end"
                                                        aria-label="reject"
                                                        onClick={e => {
                                                            let body = {
                                                                groupId: this.props.id,
                                                                pendingId: member._id
                                                            };
                                                            let json = JSON.stringify(body);

                                                            fetch("/api/groups/pendingReject/", {
                                                                method: "PUT",
                                                                body: json,
                                                                headers: {
                                                                    'Accept': 'application/json',
                                                                    'Content-Type': 'application/json'
                                                                }
                                                            })
                                                                .then((response) => {
                                                                    if (response.status === 201) {
                                                                        this.handleAlert("Request rejected.", "success");
                                                                    }
                                                                    this.handleClose();
                                                                });
                                                        }}
                                                    >
                                                        <ClearIcon />
                                                    </IconButton>
                                                </Tooltip>
                                            </ListItemSecondaryAction>
                                        </ListItem>
                                    );
                                })}
                            </List>
                            <FormControl>
                                <Button variant="contained" type="submit" color="primary" onClick={this.handleClose}> Ok </Button>
                            </FormControl>
                        </form>
                    </Paper>
                </Modal>
            </span >
        );
    }
}
export default (JoinRequests);
