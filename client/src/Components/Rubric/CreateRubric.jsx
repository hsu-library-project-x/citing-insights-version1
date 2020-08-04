import React, { Component } from "react";
import { Button, Modal, Paper, Fab, TextField, Typography, FormControl } from "@material-ui/core";
import { withRouter } from "react-router-dom";


class CreateRubric extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,   
            rubricExists: false,
            rubricTitle: "",
            rubricElements: null,
            selectedRubric: "",
            AvailableRubrics: [],
            rubricData: [],      
        };

        this.handleOpen = this.handleOpen.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleStandardInputChange = this.handleStandardInputChange.bind(this);
		this.handleEditState = this.handleEditState.bind(this);

    }

    handleOpen = () => {
        this.setState({ open: true });
    };

    handleClose = () => {
        this.setState({ open: false });
    };

    
	handleStandardInputChange(event) {
		const target = event.target;
		const value = target.value;
		const name = target.name;
		this.setState({
			[name]: value
		});
    }

    handleEditState() {
		let count = this.state.rubricElements;
		let reg = new RegExp('^\\d+$');
		if (count > 0 && count < 6 && count.match(reg)) {
           
			this.props.handleEditExistingRubric(
                false, 
                this.state.selectedRubric,
                this.state.rubricTitle, 
                this.state.rubricElements,
                 this.state.rubricData, 
                'edit');
		}
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
                    Create New Rubric
                </Fab>
                <Modal
                    aria-labelledby="create-new-rubric-modal"
                    className={'modal_form'}
                    open={this.state.open}
                    onClose={this.handleClose}
                    closeAfterTransition={true}
                    style={{marginTop:'5%', width:'50%', marginRight:'auto', marginLeft:'auto', overflow: 'auto'}}
                >
                    <Paper>
                        <Typography style={{ paddingTop: "1em" }} align={"center"} variant={"h4"}
                            component={"h2"} gutterBottom={true}> Create New Rubric   </Typography>


                        <Typography variant="subtitle1" component="h3">
                               Rubric should not have more than 5 Elements
                        </Typography>
                        
                        <FormControl style={{ minWidth: 250, marginBottom: "1em" }}>
							<TextField
                                style={{marginBottom: "1em"}}
								onChange={this.handleStandardInputChange}
								type="number"
								label={"Number of Elements (1-5)"}
								helperText={"Number of Elements (1-5)"}
								placeholder="Rubric Elements"
								name="rubricElements"
								inputProps={{
									min: "1", max: "5", step: "1"
								}} />
						
						<Button
							color='primary'
							variant={'contained'}
							onClick={this.handleEditState}
                        >
							Go
						</Button>
                        </FormControl>
                    </Paper>
                </Modal>
            </div >
        );
    }
}

export default withRouter(CreateRubric);