import React, {Component} from "react";
import {
    Avatar,
    Divider,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Tooltip
} from "@material-ui/core";

import ClassIcon from "@material-ui/icons/Class";
import AssignmentIcon from "@material-ui/icons/Assignment";

class CreateSharedList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            list: [],
            GroupName: "",
        };

        this.nestItems = this.nestItems.bind(this);
        this.handleAlert = this.handleAlert.bind(this);
        this.tick = this.tick.bind(this);
    }



    tick(oldProgress) {
        this.setState({ progress: oldProgress + 1 });
    }

    handleAlert(message, severity) {
        this.props.handleQueueAlert(message, severity);
    }

    handleInputChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        this.setState({
            [name]: value
        });
    }

    
    nestItems(classes, assignments) {
        if(classes === undefined  && assignments === undefined ){
            return <p align='center'> Currently no courses or assignments are being shared with you</p>
        }
        else{       
                let singletonAssignmnets = [];
                let nestedList=[];
                          // user only has assingmnets shared 
                          if( classes === undefined  && assignments !== undefined){
                            
                            if(assignments.length < 1){
                                return <p align='center'> 
                                    Currently no courses or assignments are being shared with you
                                </p>
                            }else{
                               
                                return assignments.map(a => {
                                    let a_notes = a.note ? a.note : "";
                                    return (
                                        <div key={`divider-${a._id}`}>
                                            <ListItem id={a._id} style={{margin: 0}} key={a._id}>
                                                <ListItemAvatar>
                                                    <Avatar>
                                                        <AssignmentIcon/>
                                                    </Avatar>
                                                </ListItemAvatar>
                                                <ListItemText
                                                    primary={a.name}
                                                    secondary={a_notes}
                                                />
                                            </ListItem>
                                            <Divider variant="inset"/>
                                        </div>
                                    );
                                });
                            }  
                        }
                
                        //user only has classes shared
                        if( assignments === undefined && classes !== undefined){
                            if(classes.length < 1){
                                return <p align='center'> 
                                    Currently no courses or assignments are being shared with you
                                </p>
                            }else{
                                return classes.map(d => {
                                    let notes = d.course_note ? d.course_note : "";
                                    return (
                                        <List key={d._id} component={"div"}
                                              disablePadding={true}
                                              style={{paddingLeft: "4em"}}
                                              dense={true}
                                        >
                                            <ListItem key={d._id} id={d._id}>
                                                <ListItemAvatar>
                                                    <Avatar>
                                                        <ClassIcon/>
                                                    </Avatar>
                                                </ListItemAvatar>
                                                <ListItemText
                                                    style={{padding: 0, margin: 0}}
                                                    primary={d.name}
                                                    secondary={notes}
                                                />
                                            </ListItem>
                                            <Divider variant="inset"/>
                                        </List>
                                    );
                             });
                           }
                    }
                
                //user has classes & assignments shared with them .... 
                // coveres class with nested assignments and then just stand alone assignments
                if (classes !== undefined && assignments !== undefined){
                    if(classes.length < 1 && assignments.length < 1){
                        return <p align='center'> Currently no courses or assignments are being shared with you</p>
                    }
                    else if (classes.length < 1 && assignments.length >= 1){
                        assignments.map(a => {
                            let a_notes = a.note ? a.note : "";
                            singletonAssignmnets.push(
                                <div key={`divider-${a._id}`}>
                                    <ListItem id={a._id} style={{margin: 0}} key={a._id}>
                                        <ListItemAvatar>
                                            <Avatar>
                                                <AssignmentIcon/>
                                            </Avatar>
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={a.name}
                                            secondary={a_notes}
                                        />
                                    </ListItem>
                                    <Divider variant="inset"/>
                                </div>
                            );
                        }); 
                    }
                    else{
                        nestedList = classes.map(d => {
                            let notes = d.course_note ? d.course_note : "";
                            return (
                                <List key={d._id} component={"div"}
                                      disablePadding={true}
                                      style={{paddingLeft: "4em"}}
                                      dense={true}
                                >
                                    <ListItem key={d._id} id={d._id}>
                                        <ListItemAvatar>
                                            <Avatar>
                                                <ClassIcon/>
                                            </Avatar>
                                        </ListItemAvatar>
                                        <ListItemText
                                            style={{padding: 0, margin: 0}}
                                            primary={d.name}
                                            secondary={notes}
                                        />
                                    </ListItem>
                                    <Divider variant="inset"/>
                                    <ListItem>
                                    <List
                                        component={"div"}
                                        disablePadding={true}
                                        style={{paddingLeft: "4em"}}
                                        dense={true}
                                    >
                                       {
                                        assignments.map(a => {
                                            let a_notes = a.note ? a.note : "";
                                            if (a.class_id === d._id) {
                                                
                                                return (
                                                    <div key={`divider-${a._id}`}>
                                                        <ListItem id={a._id} style={{margin: 0}} key={a._id}>
                                                            <ListItemAvatar>
                                                                <Avatar>
                                                                    <AssignmentIcon/>
                                                                </Avatar>
                                                            </ListItemAvatar>
                                                            <ListItemText
                                                                primary={a.name}
                                                                secondary={a_notes}
                                                            />
                                                        </ListItem>
                                                        <Divider variant="inset"/>
                                                    </div>
                                                );
                                            }
                                        //      else{
                                        //         //check other assignments
                                        //         singletonAssignmnets.push(
                                        //         <div key={`divider-${a._id}`}>
                                        //             <ListItem id={a._id} style={{margin: 0}} key={a._id}>
                                        //                 <ListItemAvatar>
                                        //                     <Avatar>
                                        //                         <AssignmentIcon/>
                                        //                     </Avatar>
                                        //                 </ListItemAvatar>
                                        //                 <ListItemText
                                        //                     primary={a.name}
                                        //                     secondary={a_notes}
                                        //                 />
                                        //             </ListItem>
                                        //             <Divider variant="inset"/>
                                        //         </div>
                                        //     );
                                        //     } 
                                        }) }                
                                    </List>
                                    </ListItem>
                                </List>
                            );
                        });
                    }

                    return (
                        <List 
                            key={'mainList'} component={"div"}
                            disablePadding={true}
                            dense={true}
                         >
                             <ListItem>
                                {nestedList}
                             </ListItem>
                             <ListItem>
                             {singletonAssignmnets}
                             </ListItem>
                            
                        </List>
                    )
                  
                }
        
      
        }
    }

    render() {
        return (
            <List dense={true} style={{ padding: 0 }} >
                {
                    this.nestItems(this.props.sharedClassList, this.props.assignmentList)
                }
            </List>
        );      
    }
}

export default CreateSharedList;