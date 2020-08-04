import React, { Component } from 'react';
import {
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    ListItemAvatar,
    Avatar,
    Tooltip,
    IconButton,
    Link,
} from "@material-ui/core";

import VisibilityIcon from '@material-ui/icons/Visibility';
import BallotRoundedIcon from '@material-ui/icons/BallotRounded';

class CreateSharedRubricList extends Component{
    constructor(props) {
        super(props);

        this.handleViewRubric = this.handleViewRubric.bind(this);
    }

    //called when clicking on the rubric list
    handleViewRubric(event, curId) {
        event.preventDefault(); 
 
        let rubric = null;
        this.props.SharedRubrics.forEach(function (r) {
            if (r._id === curId) {
                rubric = r;
            }
        });

        let rubricData = {};

        rubric.cards.forEach(c => {
            rubricData[`cardTitle-${rubric.cards.indexOf(c)}`] = c.cardTitle;
            rubricData[`cardText-${rubric.cards.indexOf(c)}`] = c.cardText;
        });

   
        this.props.handleEditExistingRubric(true, curId, rubric.name, rubricData.length, rubricData, 'view');
    }

   
    GenList(){
        return <List 
                    component={"div"}
                    disablePadding={true}
                    style={{ paddingLeft: "4em" }}
                    dense={false}
                >
                {this.props.SharedRubrics.length < 1 ? 
                    <p align='center'>Currently no rubrics are being shared with you</p> 
                :   
                    this.props.SharedRubrics.map((rubric) => {
                        if(rubric.user_id !== this.props.user_id){
                            const labelId = `rubric-list-label-${rubric._id}`;
                            return (
                                <ListItem
                                    key={labelId}
                                >
                                    <ListItemAvatar>
                                        <Avatar>
                                            <BallotRoundedIcon />
                                        </Avatar>
                                    </ListItemAvatar>
                            
                                    <ListItemText
                                        primary={rubric.name}
                                    />

                                <ListItemSecondaryAction>

                                    <Tooltip title="View Rubric" aria-label="view rubric">
                                        
                                            <IconButton
                                                edge="end"
                                                aria-label="view"
                                            >
                                                <Link
                                                    color="inherit"
                                                    id={rubric._id}
                                                    component={'div'}
                                                    onClick={(e) => this.handleViewRubric(e,rubric._id)}
                                                > 
                                                <VisibilityIcon />
                                                </Link>
                                            </IconButton>

                                    </Tooltip>
                                </ListItemSecondaryAction>
                                </ListItem>
                            ); 
                        }
                    })
                } 
        </List>;

    }

    render() {
        return(
            <div>
                {this.props.SharedRubrics ? this.GenList() : <p align='center'> Currently no rubrics are being shared with you</p>}
            </div>
        ); 
    }
}

export default CreateSharedRubricList;