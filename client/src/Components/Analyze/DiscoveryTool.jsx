import React, { Component } from 'react';
import { Card } from '@material-ui/core';

class DiscoveryTool extends Component {
    constructor(props) {
        super(props);
        this.state = {
            citation: '',
            citations: '',
            current_citation_id: this.props.current_citation_id,
        };

        this.getCurrentCitation = this.getCurrentCitation.bind(this);
        this.open_s2 = this.open_s2.bind(this);
        this.open_alma_primo = this.open_alma_primo.bind(this);
        this.open_google_scholar = this.open_google_scholar.bind(this);
    }


    componentDidMount() {
        this.getCurrentCitation();
    }


    getCurrentCitation() {
        let current = {};
        this.props.citations.forEach(c => {
            if (c["_id"] === this.props.current_citation_id) {
                current = c;
                this.setState({
                    citation: current
                });
            }
        });
    }

    open_s2() {
        let citation = this.state.citation;
        if (citation.s2PaperUrl !== undefined) {
            let win = window.open(citation.s2PaperUrl);
            win.focus();
        } else {
            var query = encodeURI(citation["author"][0]["family"] + " " + citation["title"][0]);
            var win = window.open("https://www.semanticscholar.org/search?q=" + query, '_blank');
            win.focus();
        }
    }

    open_alma_primo() {
        let query = encodeURI(this.state.citation["title"][0]);
        let url = this.props.oneSearchUrl;
        let vid = this.props.oneSearchViewId;


        // Some Exception Handling would be nice in case the URL provided doesn't work!
        //   
        //ex. https://chico-primo.hosted.exlibrisgroup.com/primo-explore/
        //ex. https://humboldt-primo.hosted.exlibrisgroup.com/primo-explore/

        let win = window.open(`https://${url}/search?vid=${vid}&query=title,begins_with,${query},AND&tab=everything&search_scope=EVERYTHING&sortby=title&lang=en_US&mode=advanced&offset=0&pcAvailability=true`, '_blank');
        win.focus();
    }

    open_google_scholar() {
        let query = encodeURI(this.state.citation["author"][0]["family"] + " " + this.state.citation["title"][0]);
        let win = window.open("https://scholar.google.com/scholar?q=" + query, '_blank');
        win.focus();
    }

    render() {
        return (
            <div className="discoveryTool" >
                <h4>Discovery Tool</h4>
                <Card>
                    <button onClick={this.open_s2}>
                        Semantic Scholar
                    </button>
                    <p>
                        Citation Velocity: {this.state.citation.citationVelocity}
                        <br />
                        Influential Citations: {this.state.citation.influentialCitationCount}
                    </p>
                </Card>
                <Card>
                    <button onClick={this.open_google_scholar}>
                        Google Scholar
                    </button>
                    <p>Search with Google Scholar</p>
                </Card>
                <Card>
                    <button onClick={this.open_alma_primo}>
                        Alma-Primo
                    </button>
                    <p>Search through Library Discovery System</p>
                </Card>

            </div>
        );
    }
}

export default DiscoveryTool; 