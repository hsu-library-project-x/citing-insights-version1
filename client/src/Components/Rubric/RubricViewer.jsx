import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import {Button, Card, CardContent, Container, Divider, Typography} from "@material-ui/core";

class RubricViewer extends Component {
    constructor(props) {
        super(props);
        this.state={
                rubricData: this.props.rubricData,
                rubricTitle: this.props.rubricTitle,
        };


        this.buildCards = this.buildCards.bind(this);
    };

    componentWillUnmount() {
        this.props.ChangeRubric();
    }

    buildCards() {
        let cards = [];
        let that=this;
        if (this.props.rubricExists) {
            let rubric = null;
            that.props.AvailableRubrics.forEach( function(r) {
                if (r._id === that.props.selectedRubric){
                    rubric = r;
                }
            });

            cards = rubric ? rubric.cards.map(c => {
                return(
                    <Card key={`card number ${rubric.cards.indexOf(c)}`}>
                        <CardContent>
                            <Typography variant="subtitle1" component="h3">
                                 {c.cardTitle}
                            </Typography>
                            <Divider light />
                            <Typography variant="subtitle2" component="h4">
                                 {c.cardText}
                            </Typography>
                        </CardContent>
                    </Card>
                );
            }):null;

            return cards;

        } 
          
    }

    render() {
        return(
            <div>
                <Button color='primary' variant='contained'
                        onClick={() => this.props.history.push('/tasks/rubric')}>
                    Go Back to Rubric Menu
                </Button>
                
                <Container maxWidth={"sm"}>
                    <Typography variant="h4" component="h1" align='center'>
                             {this.state.rubricTitle}
                    </Typography>
                
                    {this.buildCards()}
                </Container>
            </div>
        );
    }
}

export default withRouter(RubricViewer);