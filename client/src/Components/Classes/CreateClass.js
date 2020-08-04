import React, {Component} from "react";
import {
    TextField,
    Modal,
    Paper,
    Button,
    Fab,
    Typography,
    FormControl
} from "@material-ui/core";
import ClassIcon from '@material-ui/icons/Class';

class CreateClass extends Component {
    constructor(props) {
        super(props);
        this.state={
            open: false,
            ClassName: '',
            ClassNote: '',
            GroupName: '',
        };
        this.handleOpen = this.handleOpen.bind(this);
        this.handleClose= this.handleClose.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmitClass = this.handleSubmitClass.bind(this);
        this.handleAlert = this.handleAlert.bind(this);
    }

    handleAlert(message, severity){
        this.props.handleQueueAlert(message, severity);
    }

    handleOpen = () => {
        this.setState({open: true});
    };

    handleClose = () => {
        this.setState({open:false});
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

    async handleSubmitClass(event) {
        event.preventDefault();
        let that = this;

        const data = {
            "name": this.state.ClassName,
            "note": this.state.ClassNote,
            "user_id": this.props.user_id,
        };

        let newClass = JSON.stringify(data);
        fetch('/api/courses/', {
            method: 'POST',
            body: newClass,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
        })
            .then((response) => {
                if (response.status === 201 || response.ok){
                    that.handleAlert("Class Created", "success");
                    this.setState({
                        open: false,
                    })
                    // this.setState({
                    //     ClassName: "",
                    //     ClassNote: "",
                    //     open:false,
                    // },()=>this.handleAlert('Class Created', 'success'));
                }
                else{
                    that.handleAlert('Could not Create Class', 'error');
                    this.setState({
                        open: false,
                    });
                    // this.setState({open:false},()=>this.handleAlert('Could not Create Class', 'error'));
                }
        });
    }

    render(){
        return(
                <div>
                    <Fab type="button"
                         variant="extended"
                         color={'primary'}
                         onClick={this.handleOpen}
                         size={"small"}
                         style={{float:"right", margin:"1em"}}
                    >
                        <ClassIcon />
                        Create Class
                    </Fab>
                    <Modal
                        aria-labelledby="create-class-modal"
                        aria-describedby="form-to-add-class-to-database"
                        open={this.state.open}
                        onClose={this.handleClose}
                        closeAfterTransition={true}
                        style={{marginTop:'5%', width:'50%', marginRight:'auto', marginLeft:'auto', overflow: 'auto'}}
                        >
                        <Paper>
                            <Typography style={{paddingTop: "1em"}} align={"center"} variant={"h4"} component={"h2"} gutterBottom={true}> Create Class </Typography>
                            <form className={'modal_form'} onSubmit={this.handleSubmitClass}>
                                <FormControl >
                                    <TextField
                                        label={'Class Name'}
                                        onChange={this.handleInputChange}
                                        name="ClassName"
                                        // variant="filled"
                                        required
                                        style={{marginBottom: "1em"}}/>
                                    <TextField
                                        label={'Notes (optional)'}
                                        onChange={this.handleInputChange}
                                        multiline
                                        rowsMax="4"
                                        name="ClassNote"
                                        style={{marginBottom: "1em"}} />

                                        
                                <Button  variant="contained" type="submit" color="primary"> Submit </Button>
                                </FormControl>
                            </form>
                        </Paper>
                    </Modal>
                </div>
        )
    }
}

export default CreateClass;