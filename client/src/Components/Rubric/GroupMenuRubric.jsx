import React, {Component} from "react";
import {
    Collapse,
    IconButton,
    List,
    ListItem,
    ListItemAvatar,
    ListItemIcon,
    ListItemSecondaryAction,
    ListItemText,
    Popover,
    Tooltip
} from "@material-ui/core";
import ClearIcon from '@material-ui/icons/Clear';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import GroupWorkIcon from '@material-ui/icons/GroupWork'
import AddCircleIcon from '@material-ui/icons/AddCircle';
import AddIcon from '@material-ui/icons/Add';

class GroupMenuRubric extends Component {
    constructor(props) {
        super(props);

        this.state = {
            anchorEl: null,
            hoverAnchorEl: null,
            open: {
                popover: false,
                current_groups: true,
                add_group: false,
            }};

        this.handleClick = this.handleClick.bind(this);
        this.handleAlert = this.handleAlert.bind(this);
        this.handlePopoverOpen = this.handlePopoverOpen.bind(this);
        this.handlePopoverClose = this.handlePopoverClose.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.expandClick = this.expandClick.bind(this);
        this.addGroup = this.addGroup.bind(this);
    }

    expandClick(item) {
        this.setState({
            open: { [item]: !this.state.open[item] }
        });
    }

    handleClick(event) {
        this.setState({ anchorEl: event.currentTarget });
    }

    handleClose() {
        this.setState({ anchorEl: null,
            open: {
                popover: false,
                current_groups: true,
                add_group: false,
            }});
    }

    handleAlert(message, severity) {
        this.props.handleQueueAlert(message, severity);
    }

    handlePopoverClose() {
        this.setState({
            hoverAnchorEl: null
        });
    }

    handlePopoverOpen(event) {

        this.setState({
            hoverAnchorEl: event.currentTarget
        });
    }

    addGroup(id, group, members, creator){

        let allMembers = members.push(creator);

        let toAdd= {
            'group_id': group,
            'members': members,
        }
        
        let body = JSON.stringify(toAdd);

        fetch(`/api/rubrics/updateGroup/${id}`, {
            method: "PUT",
            body: body,
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            }
        })
            .then((response) => {
                if (response.status === 201) {
                    this.handleAlert("Group Added", "success");
                }
                else {
                    this.handleAlert("Unable to add group.", "error");
                }
                this.handleClose();

            });

    }

    removeGroup( id, group, members, creator){
       
        let memberCheck = members;

        if(this.props.user_email !== creator){
            memberCheck.push(creator);
        }

        let toRemove = {
            'group_id': group,
            'members': members,
        }

        let body = JSON.stringify(toRemove);

        fetch(`/api/rubrics/removeGroup/${id}`, {
            method: "PUT",
            body: body,
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            }
        })
            .then((response) => {
                if (response.status === 201) {
                    this.handleAlert("Group Removed", "success");
                }
                else {
                    this.handleAlert("Unable to remove group.", "error");
                }
                this.handleClose();

            });

    }


    groupMenu(id) {
        let currentGroupList =[];
        let couldAddList =[];
        let listItem =[];

        if (this.props.rubricList){
            this.props.rubricList.forEach(r => {
                if (r._id === id){
                    if(r.group_ids !== undefined){
                        listItem = r.group_ids;
                    }
                }
            })
        }else{
            listItem = [];
        }

        if(this.props.availableGroups !== undefined){
            this.props.availableGroups.forEach(g => {
                if(listItem.includes(g._id) === true){
                    currentGroupList.push(g);
                }
                else{
                    couldAddList.push(g);
                }
            });
        }

        let open = Boolean(this.state.anchorEl);
        let groupsOpen = this.state.open['current_groups'];
        let addOpen = this.state.open['add_group'];
    


        let optionGroups = couldAddList.map((group) => {
            // if this is not an added group
            return (
                <ListItem
                    key={group._id}
                >
                    <ListItemText
                        style={{ padding: 0, margin: 0 }}
                        primary={group.name}
                    />
                    <ListItemSecondaryAction>
                        <Tooltip title="Add Group" aria-label="add group">
                            <IconButton edge="end" aria-label="add group" onClick={() => this.addGroup(id, group._id, group.members, group.creator)}>
                                <AddIcon />
                            </IconButton>
                        </Tooltip>
                    </ListItemSecondaryAction>
                </ListItem>
            );
        });

        let currentGroups = currentGroupList.map((group) => {
            // if this IS an added group
            return (<ListItem key={group._id}>
                <ListItemText
                    style={{ padding: 0, margin: 0 }}
                    primary={group.name}
                />
                <ListItemSecondaryAction>
                    <Tooltip title="Remove Group" aria-label="remove group">
                        <IconButton edge="end" aria-label="remove group" onClick={()=> this.removeGroup(id, group._id, group.members, group.creator)}>
                            <ClearIcon />
                        </IconButton>
                    </Tooltip>
                </ListItemSecondaryAction>
            </ListItem>);
        });

        return (
            <Popover
                open={open}
                anchorEl={this.state.anchorEl}
                onClose={this.handleClose}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
                style={{overflow: 'auto'}}
            >
                <List
                    aria-labelledby={"group management menu"}
                    dense={true}
                    style={{ paddingLeft: "1em" }}
                >
                    <ListItem button onClick={() => this.expandClick('current_groups')}>
                        <ListItemIcon>
                            <GroupWorkIcon />
                        </ListItemIcon>
                        <ListItemText primary={"current groups"} />
                        {groupsOpen ? <ExpandLess /> : <ExpandMore />}
                    </ListItem>
                    <Collapse
                        in={groupsOpen}
                        timeout={'auto'}
                        unmountOnExit
                    >
                        <List
                            desnse={true}
                        >
                            {currentGroups}
                        </List>
                    </Collapse>
                    <ListItem button onClick={() => this.expandClick('add_group')}>
                        <ListItemIcon>
                            <AddCircleIcon />
                        </ListItemIcon>
                        <ListItemText primary={"Add group"} />
                        {addOpen ? <ExpandLess /> : <ExpandMore />}
                    </ListItem>
                    <Collapse
                        in={addOpen}
                        timeout={'auto'}
                        unmountOnExit
                    >
                        <List dense={true}>
                            {optionGroups}
                        </List>
                    </Collapse>
                </List>
            </Popover>
        );
    }

    render(){
  
        return(
            <span>
            <Tooltip title="Groups" aria-label="groups">
                <IconButton edge="end" aria-label="groups"
                            onClick={this.handleClick}
                >
                    <MoreVertIcon/>
                </IconButton>
             </Tooltip>
                {this.groupMenu(this.props.id)}
            </span>
        );
    }
}

export default GroupMenuRubric;
