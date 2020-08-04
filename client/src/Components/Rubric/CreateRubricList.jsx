import React, { Component } from 'react';
import {
    Checkbox,
    IconButton,
    Link,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    ListItemAvatar,
    Avatar,
    Toolbar,
    Tooltip,
    Typography
} from "@material-ui/core";
import GroupMenuRubric from "./GroupMenuRubric";
import DeleteIcon from "@material-ui/icons/Delete";
import BallotRoundedIcon from '@material-ui/icons/BallotRounded';
import EditIcon from "@material-ui/icons/Edit";
import MoreVertIcon from '@material-ui/icons/MoreVert';

class CreateRubricList extends Component{
    constructor(props) {
        super(props);

        this.handleToggle = this.handleToggle.bind(this);
        this.handleDeleteRubric = this.handleDeleteRubric.bind(this);
        this.handleEditRubric = this.handleEditRubric.bind(this);
        this.handleAlert = this.handleAlert.bind(this);
    }

    handleAlert(message, severity){
        this.props.handleQueueAlert(message, severity);
    }


    //called when clicking on the rubric list
    handleEditRubric(event, curId) {
        event.preventDefault(); 
 
        let rubric = null;
        this.props.rubrics.forEach(function (r) {
            if (r._id === curId) {
                rubric = r;
            }
        });

        let rubricData = {};

        rubric.cards.forEach(c => {
            rubricData[`cardTitle-${rubric.cards.indexOf(c)}`] = c.cardTitle;
            rubricData[`cardText-${rubric.cards.indexOf(c)}`] = c.cardText;
        });

        this.props.handleEditExistingRubric(true, curId, rubric.name, rubricData.length, rubricData, 'edit');
    }

    //handles deleting a rubric
    handleDeleteRubric(toDelete) {
        let that = this;
        if (window.confirm("Are you sure you wish to delete this rubric? This rubric will be deleted for all those you share it with. ")) {
            fetch('/api/rubrics/' + toDelete, {
                method: 'Delete',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
            }).then(response => {
                if (response.status === 201 || response.ok) {
                    that.setState({
                        checked: [],
                    }, ()=>that.handleAlert('Rubric Deleted', 'success'));
                }else{
                    that.handleAlert('Could not Delete Rubric', 'error');
                }
            });
        }
    }

    handleToggle = value => () => {
        const currentIndex = this.state.checked.indexOf(value);
        const newChecked = [...this.state.checked];

        if (currentIndex === -1) {
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }

        this.setState({ checked: newChecked });
    };

    GenList(){
     if(this.props.rubrics.length < 1 ) {
         return <p align='center'>Currently you are not the creator of any rubrics</p> 
     }else{
        return <List 
                    component={"div"}
                    disablePadding={true}
                    style={{ paddingLeft: "4em" }}
                    dense={false}
                >
                    {this.props.rubrics.map((rubric) => {
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

                                    <Tooltip title="Edit Rubric" aria-label="edit rubric">
                                        
                                            <IconButton
                                                edge="end"
                                                aria-label="edit"
                                            >
                                                <Link
                                                    color="inherit"
                                                    id={rubric._id}
                                                    component={'div'}
                                                    onClick={(e) => this.handleEditRubric(e,rubric._id)}
                                                > 
                                                <EditIcon />
                                                </Link>
                                            </IconButton>
                                    
                                    </Tooltip>
                                
                                    <Tooltip title="Delete Rubric" aria-label="delete rubric">
                                        <IconButton edge="end" aria-label="delete"
                                                    onClick={() => this.handleDeleteRubric(rubric._id)}>
                                            <DeleteIcon/>
                                        </IconButton>
                                    </Tooltip>
                                    <GroupMenuRubric
                                        id={rubric._id}
                                        handleQueueAlert={this.props.handleQueueAlert}
                                        availableGroups={this.props.availableGroups}
                                        rubricList={this.props.rubrics}
                                    />
                                </ListItemSecondaryAction>
                            </ListItem>
                        );} 
                    )} 
                </List>
        }    
    }

    render() {
        return <div> {this.GenList()} </div>
    }

}

export default CreateRubricList;