import React, { Component } from 'react';
import {Input} from "@material-ui/core";
import {createMuiTheme, MuiThemeProvider} from "@material-ui/core/styles";

class Dropzone extends Component {
	constructor(props) {
		super(props);
		this.state = {
			highlight: false
		};

	    this.fileInputRef = React.createRef();
	    this.handleFile = this.handleFile.bind(this);
	    this.fileListToArray = this.fileListToArray.bind(this);

	}

	handleFile(event){
		this.props.onFilesAdded(this.fileListToArray(event.target.files));
	}

	fileListToArray(list) {
		const array = [];
		for (let i = 0; i < list.length; i++) {
		    array.push(list.item(i));
		}
		return array;
	}

    render() {
		const theme = createMuiTheme({
			palette: {
				primary: { main: '#25551b' }, // dk green
				secondary: { main: '#5C8021' } // light green
			},
		});

	    return (
			<MuiThemeProvider theme={theme}>
				<Input
					className={"FileInput"}
					required
					color={"primary"}
					inputRef={this.fileInputRef}
					type="file"
					multiple
					onChange={this.handleFile}
				/>
			</MuiThemeProvider>

	    );
    }
}

export default Dropzone
