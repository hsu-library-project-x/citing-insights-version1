import React, { Component } from "react";
import { Select, Modal, Paper, Fab, MenuItem, Typography, FormControl, InputLabel } from "@material-ui/core";
import { withRouter } from "react-router-dom";
import defaultRubricsJson from '../../default_rubrics/defaultRubric.json';

class AddDefaultRubric extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,         
        };

        this.handleOpen = this.handleOpen.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleAlert = this.handleAlert.bind(this);
        this.handleDefaultRubric = this.handleDefaultRubric.bind(this);
       

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

    handleDefaultRubric(event) {
		event.preventDefault();

		let rubricToAdd = defaultRubricsJson[event.target.value];
				
		rubricToAdd.user_id = this.props.user.id;
		const defaultString = JSON.stringify(rubricToAdd);

		fetch('/api/rubrics/', {
			method: 'POST',
			body: defaultString,
			mode: 'cors',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			}
		}).then(response => {
			if (response.status === 304) {
				this.handleAlert('Rubric Already Added', 'warning');
			} else if (response.status === 201) {
				this.handleAlert('Rubric Added', 'success');
			} else {
				this.handleAlert('Could not Add Rubric', 'error');
			}
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
                    Add AAC&U Rubric
                </Fab>
                <Modal
                    aria-labelledby="add-default-modal"
                    className={'modal_form'}
                    open={this.state.open}
                    onClose={this.handleClose}
                    closeAfterTransition={true}
                    style={{marginTop:'5%', width:'50%', marginRight:'auto', marginLeft:'auto', overflow: 'auto'}}
                >
                    <Paper>
                        <Typography style={{ paddingTop: "1em" }} align={"center"} variant={"h4"}
                            component={"h2"} gutterBottom={true}> Add Rubric Created by the Association of American Colleges and Universities   </Typography>
                        
                        <FormControl margin={'normal'}  >
							<InputLabel id={'selectRubriclabel'}> Select a Rubric </InputLabel>
							<Select
                                style={{minWidth: 200}}
								labelId={"selectRubriclabel"}
								onChange={this.handleDefaultRubric}
								defaultValue={""}
								inputProps={{
									name: 'rubDefaultbutton',
								}}
							>
								<MenuItem value="" disabled >select rubric </MenuItem>
								<MenuItem value={0}> Determine the Extent of Information Needed </MenuItem>
								<MenuItem value={1}>Evaluate Information and its Sources Critically</MenuItem>
								<MenuItem value={2}>Use Information Effectively to Accomplish a Specific Purpose</MenuItem>
								<MenuItem value={3}>Access and Use Information Ethically and Legally</MenuItem>
								<MenuItem value={4}>Sources and Evidence</MenuItem>
								<MenuItem value={5}>Evidence</MenuItem>
							</Select>
						</FormControl>
                    </Paper>
                </Modal>
            </div >
        );
    }
}

export default withRouter(AddDefaultRubric);