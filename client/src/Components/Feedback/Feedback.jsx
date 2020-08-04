import React, {Component} from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import FeedbackIcon from '@material-ui/icons/Feedback';
class Feedback extends Component {
  constructor(props){
    super(props);

    this.state={
      open: false,
      message: "",
      email: ""
    };

    this.handleClickOpen = this.handleClickOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleInput = this.handleInput.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleClickOpen() {
    this.setState({
      open: true
    });
  }

  handleClose() {
    this.setState({
      message: "",
      email: "",
      open: false
    });
  }

  handleInput(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    //alert(name + ", " + value);
    this.setState({
      [name]: value
    },
    );
  }

  handleSubmit() {
    let data = {
      message: this.state.message,
      email: this.state.email,
    };

    let json = JSON.stringify(data);

    fetch("/api/feedback/", {
      method: "POST",
      body: json,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
    .then(() => { //unused param response
      this.handleClose();
      alert("Thanks, feedback successfully submitted!");
    })
  }
  
  render() {
    return (
      <div>
        <Button size="small" variant={"contained"} startIcon={<FeedbackIcon color={"secondary"}  />} className={"NavLinkButton"} onClick={this.handleClickOpen}>
          Give Feedback
          </Button>
        <Dialog open={this.state.open} onClose={this.handleClose} aria-labelledby="form-dialog-title">
          <DialogTitle id="form-dialog-title">Feedback</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Please help us by providing feedback. Be as specific as you wish, and submit
              as many of these tickets as desired.
          </DialogContentText>
            <TextField
              autoFocus
              margin="none"
              id="name"
              type="text"
              multiline
              fullWidth
              placeholder="Give Feedback....."
              onChange={this.handleInput}
              inputProps={{
                name: 'message',
              }}
            />
            <TextField
              autoFocus
              margin="none"
              id="contact"
              type="text"
              placeholder="[Optional] Email: "
              onChange={this.handleInput}
              inputProps={{
                name: 'email',
              }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary">
              Cancel
          </Button>
            <Button onClick={this.handleSubmit} color="primary">
              Submit
          </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default Feedback;