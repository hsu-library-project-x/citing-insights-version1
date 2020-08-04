import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import {
    ExpansionPanel, ExpansionPanelDetails, ExpansionPanelSummary, Typography, Radio,FormControlLabel
}  from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

class RubricAccordion extends Component {
    constructor(props) {
        super(props);
        this.state = {
            expanded: false,
            radio_score: "",
        };

        this.createExpansion = this.createExpansion.bind(this);
    }

    createExpansion(that){
        const handleChange = panel => (event, isExpanded) => {
            let test = isExpanded ? panel : false;
            this.setState({expanded: test});
        };

        const handleSelection= (event, value) => {
            event.stopPropagation();
            this.setState({
                radio_score: event.target.value
            });
            this.props.AssessmentScore(event.target.value, value, this.props.currentRubric.name);
        };

        let rubrics = this.props.currentRubric.cards;
        let rubricList = <p> Please select a rubric </p>;

        if (rubrics !== undefined && rubrics !== []) {
            rubricList = rubrics.map(function (rubric) {
                let rId = rubric['cardTitle'];
                let value = rubric['cardScore'];
                return (
                    <ExpansionPanel expanded={that.state.expanded === rId} onChange={handleChange(rId)} key={rId}>
                        <ExpansionPanelSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls={rubric["cardText"]}
                            id={rId}
                        >
                            <FormControlLabel
                                aria-label={'Select'}
                                value={rId}
                                onClick={handleChange(rId)}
                                onFocus={event => event.stopPropagation()}
                                control={<Radio
                                    inputProps={{name:rId}}
                                    onClick={event => handleSelection(event, value)}
                                    checked={that.state.radio_score === rId}
                                />}
                                label={rId}
                            />
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails>
                            <Typography >{rubric["cardText"]}</Typography>
                        </ExpansionPanelDetails>
                    </ExpansionPanel>
                )
            });
        }

        return rubricList;
    }


    render() {
        return (
            <div> {this.createExpansion(this)}</div>

        );
    }
}

export default withRouter(RubricAccordion);
