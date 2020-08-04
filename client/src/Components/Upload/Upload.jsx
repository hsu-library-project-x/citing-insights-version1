import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import {Container, FormControl, InputLabel, Select, MenuItem, Typography,
    Button, Snackbar,CircularProgress, Backdrop} from "@material-ui/core";
import MuiAlert from '@material-ui/lab/Alert';
import Dropzone from "./Dropzone";

class Upload extends Component {
  constructor(props) {
    super(props);
    this.state = {
        classes:[],
        assignments:[],
        files: [],
        classId: "",
        refId: "",
        openSnack:false,
        progress:0,
        uploading:false,
    };

    this.getClasses();

    this.getClasses = this.getClasses.bind(this);
    this.handleClassSelection = this.handleClassSelection.bind(this);
    this.createList = this.createList.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.onFilesAdded = this.onFilesAdded.bind(this);
    this.handleSubmitFiles = this.handleSubmitFiles.bind(this);

  }

    onFilesAdded(files){
        this.setState(prevState => ({
            files: prevState.files.concat(files)
        }));
    }

  createList(json, state){
    let list=[];

    for (let i=0; i<json.length;i++ ){
        list.push(json[i]);
    }
    this.setState({[state]:list});
  }

  getClasses() {
      fetch('/api/courses/' + this.props.user.id)
         .then(function (response) {
              return response.json();
         }).then((response)=>{
             this.createList(response,'classes');
      })
    }

    handleClassSelection(event) {
        let target = event.target;
        fetch('/api/assignments/by_class_id/' + target.value)
            .then(function(response) {
                return response.json();
            })
            .then((response)=>{
                 this.createList(response,'assignments');
            }).then(()=> this.handleInputChange(event));
    }

    handleInputChange(event){
        const target = event.target;
        const value = target.value;
        const name = target.name;
        this.setState({
            [name]: value
        });

    }

    async handleSubmitFiles(event) {
      event.preventDefault();
      this.setState({uploading:true});

      const data= {
          ref_id: this.state.refId,
          files: this.state.files,
      };

       if(data.ref_id === "" || data.files === []){
          alert('Cannot upload without a file, class, or assignment');
          return;
       }

        data.files.forEach(file => {
            const formData = new FormData();
            formData.append(data.ref_id, file, file.name);

            fetch('/api/upload/',{
                method: 'POST',
                body: formData,
            }).then(() =>{
                this.setState({files:[], openSnack:true, uploading:false})
            })
        });

    }

    render(){

      let courses = this.state.classes.map((d) =>
          <MenuItem key={d._id} value={d._id}>{d.name}</MenuItem>
      );

      let assignments = this.state.assignments.map((d) =>
          <MenuItem key={d._id} value={d._id}>{d.name}</MenuItem>
      );

      function Alert(props) {
            return <MuiAlert elevation={6} variant="filled" {...props} />;
        }

    return(
        this.state.uploading ?
            <Backdrop open={this.state.uploading}>
                <CircularProgress className='circularProgress' color="secondary" />
            </Backdrop>:
                <div>
                    <Snackbar
                        open={this.state.openSnack}
                        role={"alert"}
                        autoHideDuration={3000}
                        anchorOrigin={{horizontal:'right', vertical:'top'}}
                    >
                        <Alert  severity="success"
                                onClose={()=> this.setState({openSnack: false})}>
                            Files Uploaded
                        </Alert>

                    </Snackbar>
                    <Typography style={{marginTop: "1em"}} align={"center"} variant={"h3"} component={"h1"} gutterBottom={true}>
                        Upload Files
                    </Typography>
                    <Typography align={"center"} variant={"subtitle1"} component={"p"} gutterBottom={true}>
                        Please upload papers as PDF
                    </Typography>

                    <Container maxWidth={'md'} className={"container"}>
                        <form style={{textAlign:"center", margin:"1em"}} onSubmit={this.handleSubmitFiles}>
                            <FormControl style={{minWidth: 250}}>
                                <InputLabel id="selectClasslabel">Select a Class</InputLabel>
                                <Select
                                    style={{textAlign:"center"}}
                                    labelId={"selectClasslabel"}
                                    onChange={this.handleClassSelection}
                                    defaultValue={""}
                                    inputProps={{
                                        name: 'refId',
                                    }}
                                >
                                    <MenuItem value="" disabled >select class</MenuItem>
                                    {courses}
                                </Select>
                            </FormControl>
                            <br /> <p> OR </p>
                            <FormControl   style={{minWidth: 250, marginBottom:"1em"}}>
                                <InputLabel id="selectAssignmentLabel">Select an Assignment</InputLabel>
                                <Select
                                    style={{textAlign:"center"}}
                                    onChange={this.handleInputChange}
                                    defaultValue={""}
                                    inputProps={{
                                        name: 'refId',
                                    }}
                                >
                                    <MenuItem value="" disabled> select assignment</MenuItem>
                                    {assignments}
                                </Select>
                            </FormControl>
                            <br />
                            <Dropzone
                                onFilesAdded={this.onFilesAdded}
                                disabled={this.state.uploading}
                            />
                            <br />

                            <Typography align={"center"} variant={"h6"} component={"h1"} gutterBottom={true}>
                                Files to Upload
                            </Typography>
                            {this.state.files.map(file => {
                                return (
                                    <p key={file.name}>{file.name}</p>
                                );
                            })}
                            <br />
                            <Button type='submit'
                                    variant='contained'
                                    color='primary'
                                    disabled={(this.state.refId === "" || this.state.files === [])}>
                                Upload
                            </Button>
                        </form>
                    </Container>
                </div>
    );
  }
}

export default withRouter(Upload);
