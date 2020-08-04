import React, { Component } from "react";
import { TextField, Modal, Paper, Fab, Button, Typography, FormControl } from "@material-ui/core";
import { withRouter } from "react-router-dom";
import Papa from "papaparse";

class CreateGroup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            GroupName: '',
            GroupNote: '',
            Members: '',
        };
        this.handleOpen = this.handleOpen.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleValidation = this.handleValidation.bind(this);
        this.handleAlert = this.handleAlert.bind(this);
    }

    handleAlert(message, severity) {
        this.props.handleQueueAlert(message, severity);
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
                invalid_email = members[i];
            }
        }

        if (valid) {
            return "true";
        }
        else {
            return invalid_email;
        }
    };

    handleOpen = () => {
        this.setState({ open: true });
    };

    handleClose = () => {
        this.setState({ 
            open: false,
            GroupName: '',
            GroupNote: '',
            Members: '' 
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

    render() {
        return (
            <div>
                <Fab type="button"
                    variant="extended"
                    color={'primary'}
                    onClick={this.handleOpen}
                    size={"small"}
                    style={{ margin: "1em" }}
                >
                    Create Group
                </Fab>
                <Modal
                    aria-labelledby="create-group-modal"
                    open={this.state.open}
                    onClose={this.handleClose}
                    closeAfterTransition={true}
                    style={{marginTop:'5%', width:'50%', marginRight:'auto', marginLeft:'auto', overflow: 'auto'}}
                >
                    <Paper>
                        <Typography style={{ paddingTop: "1em" }} align={"center"} variant={"h4"}
                            component={"h2"} gutterBottom={true}> Create Group   </Typography>
                        <form className={'modal_form'} onSubmit={(event) => {
                            event.preventDefault();

                            let member_array_parsed = Papa.parse(this.state.Members).data;


                            let member_array = [];

                            for (let l = 0; l < member_array_parsed.length; l++) {
                                if (member_array_parsed[l][0] !== this.props.user.email) {
                                    member_array.push(member_array_parsed[l][0]);
                                }
                                else {
                                    this.handleAlert("Group owner cannot be a group member", "error");
                                }

                            };

                            let validationCheck = this.handleValidation(member_array);


                            if(validationCheck === this.props.user.email){
                                this.handleAlert('Cannot add yourself as a member to a group you own', 'error');
                                this.handleClose();
                            }
                            else if (validationCheck !== "true") {
                                this.handleAlert(validationCheck + ' is not a valid email. Please try again.', 'error');
                                this.handleClose();

                            }else {

                                let data = {
                                    creator: this.props.user.email,
                                    name: this.state.GroupName,
                                    note: this.state.GroupNote,
                                    members: member_array
                                };

                                let json = JSON.stringify(data);

                                fetch("/api/groups/", {
                                    method: "POST",
                                    body: json,
                                    headers: {
                                        'Accept': 'application/json',
                                        'Content-Type': 'application/json'
                                    }
                                })
                                    .then((response) => {
                                        if (response.status === 201) {
                                            this.handleAlert("Group Created", "success");
                                        }
                                        else {
                                            this.handleAlert("Unable to Create Group", "error");
                                        }
                                        this.handleClose();
                                    })
                            }
                        }}
                        >
                            <FormControl>
                                <TextField
                                    label={'Group Name'}
                                    name="GroupName"
                                    value={this.state.GroupName}
                                    onChange={this.handleInputChange}
                                    required
                                    style={{ marginBottom: "1em" }} />
                                <br />
                                <TextField
                                    label={"Description (optional)"}
                                    name="GroupNote"
                                    value={this.state.GroupNote}
                                    onChange={this.handleInputChange}
                                    multiline
                                    rowsMax="4"
                                    style={{ marginBottom: "1em" }} />
                                <br />
                                <TextField
                                    label="Member Emails"
                                    name="Members"
                                    value={this.state.Members}
                                    onChange={this.handleInputChange}
                                    multiline
                                    rows={4}
                                    variant="outlined"
                                />
                                <br />
                                <Button variant="contained" type="submit" color="primary" > Submit </Button>
                            </FormControl>
                        </form>
                    </Paper>
                </Modal>
            </div >
        );
    }
}

export default withRouter(CreateGroup);