import React, { Component } from 'react';
import ImageUploader from 'react-images-upload';
import { Button, TextField, Paper, Typography } from "@material-ui/core";

class ConfigurationForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            primaryColor: "",
            secondaryColor: "",
            institutionName: "",
            oneSearchUrl: "",
            oneSearchViewId: "",
            images: [],
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.renderSplash = this.renderSplash.bind(this);
        this.uploadImage = this.uploadImage.bind(this);
        this.handleConfigurations = this.handleConfigurations.bind(this);
    }

    uploadImage = (picture) => {
        this.setState({
            images: this.state.images.concat(picture)
        });
    };

    handleConfigurations() {
        let data = new FormData();
        data.append('primaryColor', this.state.primaryColor);
        data.append('secondaryColor', this.state.secondaryColor);
        data.append('institutionName', this.state.institutionName);
        data.append('oneSearchUrl', this.state.oneSearchUrl);
        data.append('oneSearchViewId', this.state.oneSearchViewId);
        data.append('images', this.state.images[0], this.state.images[0]['name']);

        fetch('/api/configurations/', {
            method: 'POST',
            body: data,
        }).then(response => {
            if (response.status === 201 || response.ok) {
                alert("Configuration Submitted!");
                return true;
            } else {
                alert("Error: could not submit configuration");
                return false
            }
        }).then((bool) => {
            if (bool) {
                this.props.handleConfigurationChange();
            }
        });
    };

    handleSubmit = (event) => {
        event.preventDefault();
        this.handleConfigurations();
    };

    handleInputChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        this.setState({
            [name]: value
        });
    };

    renderSplash() {
        let vid = <p>Example: https://....exlibrisgroup.com/..../search?vid=<strong>01CALS_HUL</strong></p>;
        return (
            <div className={"config_background"}>
                <form className={'configuration_form'} onSubmit={this.handleSubmit} >
                    <Paper elevation={10}>
                        <Typography
                            style={{ paddingTop: "1em" }}
                            align={"center"}
                            variant={"h3"}
                            component={"h1"}
                            gutterBottom={true}>
                            Application Configuration
                        </Typography>

                        <fieldset className={'modal_fieldset'}>
                            <Typography
                                align={"left"}
                                variant={"h6"}
                                component={"h3"}
                            >
                                User Interface Colors in HEX
                        </Typography>
                            <TextField
                                label={'Primary Color'}
                                helperText={"This color should be dark"}
                                placeholder={'#000000'}
                                onChange={this.handleInputChange}
                                name="primaryColor"
                                required
                                fullWidth={true}
                            />
                            <br />
                            <TextField
                                label={'Secondary Color'}
                                helperText={"This color should be lighter"}
                                onChange={this.handleInputChange}
                                placeholder={'#ffffff'}
                                name="secondaryColor"
                                required
                                fullWidth={true}
                            />
                        </fieldset>

                        <fieldset className={'modal_fieldset'}>
                            <Typography
                                align={"left"}
                                variant={"h6"}
                                component={"h3"}
                            >
                                Institution Name
                        </Typography>
                            <TextField
                                label={'Institution Name'}
                                placeholder={'Humboldt State University'}
                                onChange={this.handleInputChange}
                                name="institutionName"
                                required
                                fullWidth={true}
                            />
                        </fieldset>

                        <fieldset className={'modal_fieldset'}>
                            <Typography
                                align={"left"}
                                variant={"h6"}
                                component={"h3"}
                            >
                                OneSearch Base URL - Library Discovery Tool
                        </Typography>
                            <TextField
                                label={'OneSearch Information'}
                                placeholder={'Enter OneSearch Base Url'}
                                helperText={"Example: humboldt-primo.hosted.exlibrisgroup.com/primo-explore"}
                                onChange={this.handleInputChange}
                                name="oneSearchUrl"
                                required
                                fullWidth={true}
                            />
                        </fieldset>

                        <fieldset className={'modal_fieldset'}>
                            <Typography
                                align={"left"}
                                variant={"h6"}
                                component={"h3"}
                            >
                                OneSearch View Id - Institution Specific (can be found in Url when doing an "everything" search)
                        </Typography>
                            <TextField
                                label={'OneSearch Information'}
                                placeholder={'vid='}
                                helperText={vid}
                                onChange={this.handleInputChange}
                                name="oneSearchViewId"
                                required
                                fullWidth={true}
                            />
                        </fieldset>

                        <fieldset className={'modal_fieldset'}>
                            <Typography
                                align={"left"}
                                variant={"h6"}
                                component={"h3"}
                            >
                                Image to Display (recommended dimensions about 800x530)
                        </Typography>

                            <ImageUploader
                                withIcon={true}
                                buttonText='Choose images'
                                onChange={this.uploadImage}
                                imgExtension={['.jpg', '.gif', '.png', '.gif']}
                                maxFileSize={5242880}
                                singleImage={true}
                                withPreview={true}
                            />
                        </fieldset>

                        <Button
                            aria-label='submit'
                            size='large'
                            variant="contained"
                            type="submit"
                            color="primary"
                            fullWidth={true}>
                            Submit
                    </Button>
                    </Paper>
                </form>
            </div>

        )
    }

    render() {
        return this.renderSplash()
    }
}

export default ConfigurationForm;
