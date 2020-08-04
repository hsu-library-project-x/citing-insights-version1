import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Container, Grid,  Typography, Paper, Tab, Tabs, Snackbar } from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import CreateRubricList from "./CreateRubricList";
import CreateSharedRubricList from "./CreateSharedRubricList";
import AddDefaultRubric from './AddDefaultRubric';
import CreateRubric from "./CreateRubric";

class Rubric extends Component {
	constructor(props) {
		super(props);
		this.state = {
			rubricData: [], // I think redundant
			availableGroups:[], 
			rubricElements: null,
			rubricTitle: "",
			AvailableRubrics: [],
			sharedRubrics: [],
			rubricExists: false,
			selectedRubric: "",
			currentlyEditing: false,
			snackbarOpen:true,
			messageInfo:null,
			tab:0,
		};

		this.queueRef = React.createRef();
		this.queueRef.current = [];

		this.getRubrics();
		this.getSharedRubrics();
		this.getGroups();


		this.handleEditState = this.handleEditState.bind(this);
		this.handleStandardInputChange = this.handleStandardInputChange.bind(this);
		this.handleEditExistingRubric = this.handleEditExistingRubric.bind(this);
		this.DisplayAlerts = this.DisplayAlerts.bind(this);
		this.processQueue = this.processQueue.bind(this);
		this.handleQueueAlert = this.handleQueueAlert.bind(this);
		this.handleClose = this.handleClose.bind(this);
		this.handleExited = this.handleExited.bind(this);
		this.handleTabChange = this.handleTabChange.bind(this);
	}

	getGroups() {
        fetch('/api/groups/').then(function (response) {
            return response.json();
        })
        .then(d => {
            this.createTreeItems(d, 'availableGroups');
        });

    }

	componentDidMount() {
		if(this.props.message !== null && this.props.severity !== null){
			this.handleQueueAlert(this.props.message, this.props.severity);
		}
	}

	processQueue(){
		if(this.queueRef.current.length >0){
			this.setState({
				messageInfo: this.queueRef.current.shift(),
				snackbarOpen:true
			});
		}
	};

	handleQueueAlert(message, severity){
		this.queueRef.current.push({
			message: message,
			severity:severity,
			key: new Date().getTime(),
		});

		if(this.state.snackbarOpen){
			this.setState({snackbarOpen:false});
		}else{
			this.processQueue();
		}
		this.getRubrics();
	};

	handleClose(event, reason){
		if(reason === 'clickaway'){
			return;
		}
		this.setState({snackbarOpen:false});
	};

	handleExited(){
		this.processQueue();
	};

	handleTabChange(event, newValue){
        this.setState({tab: newValue});
    }

	handleStandardInputChange(event) {
		const target = event.target;
		const value = target.value;
		const name = target.name;
		this.setState({
			[name]: value
		});
	}

	getRubrics() {
		let that = this;
		fetch('/api/rubrics/' + this.props.user.id)
			.then(function (response) {
				if (response.ok || response.status === 201) {
					return response.json();
				}
				else {
					that.handleQueueAlert('Could not Get Rubrics', 'error');
					return {};
				}
			}
			).then(function (myJson) {
				that.setState({ AvailableRubrics: myJson });
			});
	}
	
    createTreeItems(json, state) {
        let list = [];
        if(json !== undefined){
           
            for (let i = 0; i < json.length; i++) {
                list.push(json[i]);
            }
        
            this.setState({ [state]: list });
        }
    }

	getSharedRubrics(){
		let that = this;

		fetch(`/api/rubrics/by_email_and_ID/${this.props.user.email}/${this.props.user.id}`)
			.then(function (response) {
				if (response.ok || response.status === 201) {
					return response.json();
				}
				else {
					that.handleQueueAlert('Could not Get Shared Rubrics ', 'error');
					return {};
				}
			}).then(d => {
				this.createTreeItems(d, 'sharedRubrics');
			});
	}

	handleEditExistingRubric(
		rubricExists,
		selectedRubric,
		rubricTitle,
		rubricElements,
		rubricData, 
		type){
		
		if(type === 'edit'){
			
			this.props.updateisEditing(rubricExists,rubricTitle,rubricElements, selectedRubric,
				this.state.AvailableRubrics, rubricData, type);
		}
		if(type === 'view'){
			this.props.updateisEditing(rubricExists,rubricTitle,rubricElements, selectedRubric,
				this.state.sharedRubrics, rubricData, type);
		}
		
	}

	//toggles editor enabling editing or adding new rubrics
	handleEditState() {
		let count = this.state.rubricElements;
		let reg = new RegExp('^\\d+$');
		if (count > 0 && count < 6 && count.match(reg)) {
			this.props.updateisEditing(this.state.rubricExists, this.state.rubricTitle, this.state.rubricElements,
				this.state.selectedRubric, this.state.AvailableRubrics, this.state.rubricData);
		}
	}

	DisplayAlerts(){
		if (this.state.messageInfo || this.props.message){
			return <Snackbar
				key={this.state.messageInfo ? this.state.messageInfo.key : undefined}
				anchorOrigin={{
					vertical: 'top',
					horizontal: 'right',
				}}
				open={this.state.snackbarOpen}
				autoHideDuration={3000}
				onClose={this.handleClose}
				onExited={this.handleExited}
			>
				<Alert variant={'filled'}
					   severity={this.state.messageInfo ? this.state.messageInfo.severity : undefined}
					   onClose={this.handleClose}
				>
					{this.state.messageInfo ? this.state.messageInfo.message : undefined}
				</Alert>
			</Snackbar>
		}
	}

	
    // from mat-ui
	a11yProps(index) {
        return {
            id: `simple-tab-${index}`,
            'aria-controls': `simple-tabpanel-${index}`,
        };
	}
	
	TabPanel(value, index){
        return (
            <Grid item xs={12}>
            <div
                role="tabpanel"
                hidden={value !== index}
                id={`rubric-tabpanel-${index}`}
                aria-labelledby={`rubric-tab-${index}`}
            >
                {value === index && (
                    <Grid item xs={12}>
							{index === 0 ?
							<Grid
                            container
                            direction="row"
                            justify="flex-end"
                            alignItems="flex-end"
                       		>
								<Grid item >
									<AddDefaultRubric
											user={this.props.user}
											handleQueueAlert={this.handleQueueAlert}
									/>
								</Grid>
								
								<Grid item>
									<CreateRubric
										handleEditExistingRubric={this.handleEditExistingRubric}
									/>
								</Grid>
                            </Grid> : null}
                  
                    {index === 0 ?
                       	<CreateRubricList
						   rubrics={this.state.AvailableRubrics}
						   handleEditExistingRubric={this.handleEditExistingRubric}
						   handleQueueAlert={this.handleQueueAlert}
						   user_id={this.props.user.id}
						   availableGroups={this.state.availableGroups}
					   />	 
					   :
						<CreateSharedRubricList
							SharedRubrics={this.state.sharedRubrics}
							user_id={this.props.user.id}
							handleEditExistingRubric={this.handleEditExistingRubric}
						/>   
                    }
                    </Grid>

                )}
            </div>
            </Grid>
        );
	}
	
	render() {

		return (
			<Container maxWidth={'md'}>

				{this.DisplayAlerts()}
				<Typography style={{ marginTop: "1em" }} align={"center"} variant={"h3"} component={"h1"} gutterBottom={true}>
					Manage Rubrics
				</Typography>

				<Typography align={"center"} variant={"subtitle1"} component={"p"} gutterBottom={true}>
					You can add AAC&U Rubrics,Edit an Existing Rubric , or Create your own Rubric
				</Typography>

				<Grid xs={12}>
					<Paper square>
						<Tabs
							value={this.state.tab}
							indicatorColor={"primary"}
							textColor={"primary"}
							onChange={this.handleTabChange}
							aria-label={"my rubrics vs rubrics shared"}
							centered
						>
							<Tab label={"My Rubrics"} {...this.a11yProps(0)} />
							<Tab label={"Rubrics Shared with Me"} {...this.a11yProps(1)} />
						</Tabs>
					</Paper>
                </Grid>
                    {this.TabPanel(this.state.tab, 0)}
                    {this.TabPanel(this.state.tab, 1)}	
			</Container>
		);
	}
}

export default withRouter(Rubric);