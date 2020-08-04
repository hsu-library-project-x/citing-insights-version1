import React, { Component } from 'react';
import {Card, FormControl, InputLabel, MenuItem, Select} from '@material-ui/core';

class Citation extends Component {
    constructor(props) {
        super(props);
        this.state = {
            citations: this.props.citations,
            current_citation_id: '',
            completeCitation: "",
        };

        this.getAuthors = this.getAuthors.bind(this);
        this.formatCitation = this.formatCitation.bind(this);
        this.handleCitationChange = this.handleCitationChange.bind(this);
        this.generateCitationCard = this.generateCitationCard.bind(this);
        this.generateDropDown = this.generateDropDown.bind(this);
    }

    getAuthors(authors) {
        return authors.map((d) => {
            let family = d.family ? d.family : "";
            let given = d.given ? d.given : "";
    
            return  family + ", " + given + "\n"
            
        });
    }

    formatCitation(citation) {
       
        let date = citation.date  ? "(" + citation.date + ").": "";

        if(date === '().'){
            date = "";
        }
        
        let title = citation.title ? citation.title : "";
        
        return (
            <div key={`${citation.title}-${citation.date}`}>
                {this.getAuthors(citation.author)} {date} {title}
            </div>
        );
    }

    handleCitationChange(event) {
        this.props.updateCitationId(event.target.value);
    }

    generateCitationCard(citations, id) {
        let text = '';
     
        if (citations !== []) {
            text = citations.map(c => {
                if (c.author[0] !== undefined && c._id === id) {
                    return (this.formatCitation(c));
                } else {
                    return ("");
                }
            });
        } else {
            return "No Citation Selected";
        }

        return text;
    }

    generateDropDown(citations) {
        let drop = [];
        if (citations !== []) {
            // eslint-disable-next-line array-callback-return
            drop = citations.map(c => {
                if (c.author[0] !== undefined) {
                    return (<MenuItem value={c._id} key={c._id}> {c.author[0].family} </MenuItem>);
                }
            });
        } else {
            return [];
        }
        return drop;
    }



    render() {
        const cardText = this.generateCitationCard(this.props.citations, this.props.current_citation_id);
        const dropDownItems = this.generateDropDown(this.props.citations);
       

        return (
            <div>
                <FormControl required={true} style={{minWidth: 200, marginBottom:"1em"}}>
                    <InputLabel id={"selectCitationlabel"}>Select a Citation</InputLabel>
                    <Select
                        style={{textAlign:"center"}}
                        variant={'filled'}
                        labelId={"selectCitationlabel"}
                        defaultValue={'Select a Citation'}
                        value={this.props.current_citation_id}
                        onChange={this.handleCitationChange}
                        inputProps={{
                            name: 'className',
                            id: 'assignForAnalyze',
                        }}
                    >
                        <MenuItem value="" disabled >select citation</MenuItem>
                        {dropDownItems}
                    </Select>
                </FormControl>
                <Card>
                    {cardText}
                </Card>
            </div>
        );
    }
}

export default Citation; 