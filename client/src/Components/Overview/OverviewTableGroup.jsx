import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Button, Typography, Table, TableBody, TableCell, TableHead, TableRow } from '@material-ui/core';
import { CSVLink } from "react-csv";
import { Bar } from 'react-chartjs-2';


const columns = [

];

class OverviewTableGroup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            group: {},
            assignments: [],
            papers: [],
            citations: [],
            assignmentList: [],
            CSVrows: []
        }

        this.getGroup = this.getGroup.bind(this);
        this.getAssignments = this.getAssignments.bind(this);
        this.getPapers = this.getPapers.bind(this);
        this.fetchPapers = this.fetchPapers.bind(this);
        this.getCitations = this.getCitations.bind(this);
        this.fetchCitations = this.fetchCitations.bind(this);
        this.createRows = this.createRows.bind(this);
        this.buildAssignmentObjects = this.buildAssignmentObjects.bind(this);
        this.createBarGraph = this.createBarGraph.bind(this);
    };

    componentDidMount() {
        this.getGroup();
        this.getAssignments();
    }

    componentWillUnmount() {
        this.props.ChangeOverview();
    }

    getGroup() {
        let that = this;
        let id = this.props.group_id;
        fetch('/api/groups/' + id)
            .then(function (response) {
                return response.json();
            })
            .then(function (myJson) {
                that.setState({
                    group: myJson
                });
            });
    }

    getAssignments() {
        let that = this;
        fetch(`/api/assignments/by_group_id/${this.props.group_id}`)
            .then(response => {
                return response.json();
            })
            .then(myJson => {
                that.setState({
                    assignments: myJson
                }, this.getPapers);
            })
    }

    async getPapers() {
        let paper = {};
        let paper_array = [];
        let paper_response;
        for (let i = 0; i < this.state.assignments.length; i++) {
            paper.assignmentId = await this.state.assignments[i]._id;
            paper.assignmentName = await this.state.assignments[i].name;
            paper_response = await this.fetchPapers(this.state.assignments[i]._id)

            if (paper_response.length > 0) {
                paper.papers = paper_response;
            }

            paper_array.push(paper);
        }

        this.setState({
            papers: paper_array
        }, this.getCitations);

    }


    async fetchPapers(id) {
        let response = await fetch(`/api/papers/by_ref_id/${id}`).then(r => r.json());
        return await response;
    }

    async getCitations() {
        let citation_array = [];
        for (let i = 0; i < this.state.papers.length; i++) {
            let citation = {};
            let citation_response = {};
            if (this.state.papers[i].papers !== undefined) {
                for (let j = 0; j < this.state.papers[i].papers.length; j++) {
                    citation.paper_id = this.state.papers[i].papers[j]._id;
                    citation_response = await this.fetchCitations(this.state.papers[i].papers[j]._id);
                    if (citation_response.length > 0) {
                        citation.citations = citation_response;
                        let citationClone = JSON.parse(JSON.stringify(citation));
                        citation_array.push(citationClone);
                    }

                }
            }
        }

        this.setState({
            citations: citation_array
        });

        this.buildAssignmentObjects();


    }

    async fetchCitations(id) {
        let response = await fetch(`/api/citations/by_paper_id/${id}`).then(r => r.json());
        return await response;
    }


    createRows() {
        let data = [];

        if (this.state.assignmentList !== undefined) {
            let row = {
                'Assignment': '',
                'Paper': '',
                'Rubric': '',
                'Evaluators': [],
                'Number_of_Evaluators': 0,
                'Average_Score': 0.0,
            };
            this.state.assignmentList.forEach((assignment) => {
                row.Assignment = assignment.name;
                if (assignment.papers !== undefined) {
                    assignment.papers.forEach((paper) => {
                        console.log(paper);
                        row.Paper = paper.title;
                        if (paper.assessments !== undefined) {
                            paper.assessments.forEach((assessment) => {
                                if (assessment.user_eval !== undefined) {
                                    row.Rubric = assessment.rubric_title;
                                    row.Number_of_Evaluators = assessment.user_eval.length;
                                    row.Average_Score = assessment.average_value;
                                    assessment.user_eval.forEach((user) => {
                                        row.Evaluators.push(`${user.email} - ${user.rubric_score}`);
                                    })
                                    console.log(row);
                                    data.push(row);

                                    row = {
                                        'Assignment': assignment.name,
                                        'Paper': paper.title,
                                        'Rubric': '',
                                        'Evaluators': [],
                                        'Number_of_Evaluators': 0,
                                        'Average_Score': 0.0,
                                    };
                                }
                            })
                        }
                    })
                }
            })

            this.setState({
                CSVrows: data
            });
        }
    }






    buildAssignmentObjects() {
        // Want object to look like: 
        //  Assignment: { 
        //       id : string,
        //       name: string, 
        //       papers: [{
        //           title: string,
        //           id: string,
        //           assessments: [{
        //                user_eval : [{
        //                      email: string, 
        //                      rubric_score: string,
        //                      rubric_value: string   /**NEW**/
        //                ]},
        //                rubric_id: string,
        //                rubric_name: string,
        //                average_value: string,   /**NEW**/
        //           }]
        //       }] 
        //  }

        let assignments = this.state.assignments;
        let papers = this.state.papers;
        let citations = this.state.citations;

        let assignmentList = [];

        for (let i = 0; i < assignments.length; i++) {
            let assignment = {};
            assignment.id = assignments[i]._id;
            assignment.name = assignments[i].name;

            let paperArray = [];

            for (let j = 0; j < papers.length; j++) {
                if (papers[j].assignmentId === assignment.id) {
                    let paper = {};
                    if (papers[j].papers !== undefined) {
                        for (let k = 0; k < papers[j].papers.length; k++) {
                            let paperExists = false;
                            for (let h = 0; h < this.state.assignmentList.length; h++) {
                                if (this.state.assignmentList[h].id === papers[j].papers[k].id) {
                                    paperExists = true;
                                    break;
                                }
                            }
                            if (!paperExists) {
                                paper.title = papers[j].papers[k].title;
                                paper.id = papers[j].papers[k]._id;
                                let assessments = [];
                                let average = 0;
                                for (let t = 0; t < citations.length; t++) {
                                    if (citations[t].paper_id === paper.id) {

                                        let assessment = {
                                            user_eval: [],
                                            average_value: 0.0,
                                            rubric_id: "",
                                            rubric_title: ""
                                        };

                                        let user_eval_array = [];

                                        /* Implement the below loop when we add more citations than the initial Overall score
                                          
                                           for (let y = 0; y < citations[t].citations.length; y++) {
                                        
                                        */

                                        // check to see if 'Overall Student Paper' citation has any assessments
                                        if (citations[t].citations[0].assessments.length > 0) {

                                            for (let r = 0; r < citations[t].citations[0].assessments.length; r++) {

                                                assessment = {
                                                    user_eval: [],
                                                    average_value: 0.0,
                                                    rubric_id: "",
                                                    rubric_title: ""
                                                };
                                                let user = {};
                                                let citation = citations[t].citations[0].assessments[r];

                                                if (assessments.length > 0) {
                                                    //this check is to see if assessment has been added yet
                                                    let check = false;
                                                    //check to see if assessment correctly lines up with rubric
                                                    let check2 = false;

                                                    //loop to make sure we dont create duplicate
                                                    for (let w = 0; w < assessments.length; w++) {
                                                        check = false;
                                                        if (assessments[w].rubric_title === citation.rubric_title) {


                                                            if (assessments[w].user_eval.length > 0) {
                                                                for (let f = 0; f < assessments[w].user_eval.length; f++) {
                                                                    //see if user is already in user_evals
                                                                    if (assessments[w].user_eval[f].email === citation.email) {
                                                                        // if true, user is already in
                                                                        check2 = true;
                                                                        break;
                                                                    }
                                                                }
                                                            }

                                                            //user is not in evals
                                                            if (!check2) {
                                                                user.email = citation.email;
                                                                user.rubric_score = citation.rubric_score;
                                                                user.rubric_value = citation.rubric_value;
                                                                assessments[w].user_eval.push(user);
                                                                assessments[w].average_value += Number(user.rubric_value);
                                                                //toggle first check to signify user has been added
                                                                check = true;
                                                                break;
                                                            }
                                                        } else {
                                                            //If we reach here, a new assessment must be created
                                                            user.email = citation.email;
                                                            user.rubric_score = citation.rubric_score;
                                                            user.rubric_value = citation.rubric_value;
                                                            user_eval_array.push(user);
                                                            assessment.rubric_title = citation.rubric_title;
                                                            assessment.rubric_id = citation.rubric_id;
                                                            assessment.user_eval = user_eval_array;
                                                            assessment.average_value += Number(user.rubric_value);
                                                            user_eval_array = [];
                                                        }
                                                    }
                                                }
                                                else {
                                                    //If we reach here, this is the first assessment created
                                                    user.email = citation.email;
                                                    user.rubric_score = citation.rubric_score;
                                                    user.rubric_value = citation.rubric_value;
                                                    user_eval_array.push(user);
                                                    assessment.rubric_title = citation.rubric_title;
                                                    assessment.rubric_id = citation.rubric_id;
                                                    assessment.user_eval = user_eval_array;
                                                    assessment.average_value += Number(user.rubric_value);
                                                    user_eval_array = [];
                                                }


                                                if (assessment.user_eval.length > 0) {
                                                    assessment.average_value = (assessment.average_value / assessment.user_eval.length).toFixed(2);
                                                    assessments.push(assessment);
                                                    console.log(assessment.average_value);

                                                }

                                                assessment = {
                                                    user_eval: [],
                                                    average_value: 0.0,
                                                    rubric_id: "",
                                                    rubric_title: ""
                                                };
                                            }
                                            break;
                                        }
                                    }
                                }
                                let avg = 0.0;

                                for (let b = 0; b < assessments.length; b++) {

                                    for (let c = 0; c < assessments[b].user_eval.length; c++) {
                                        avg += Number(assessments[b].user_eval[c].rubric_value);
                                    }
                                    assessments[b].average_value = (avg / assessments[b].user_eval.length).toFixed(2);
                                    avg = 0.0;
                                }
                                paper.assessments = assessments;
                                let paperClone = JSON.parse(JSON.stringify(paper));
                                paperArray.push(paperClone);
                            }
                        }
                    }

                }
                assignment.papers = paperArray;
                assignmentList.push(assignment);
            }



            this.setState({
                assignmentList: assignmentList
            })

            this.createRows();
        }
    }

    createBarGraph(list) {

        console.log(list);

        let emails = [];
        let scores = [];

        //for each assessment, grab the average score and all the user scores
        for (let t = 0; t < list.user_eval.length; t++) {
            console.log(list.user_eval);
            emails.push(list.user_eval[t].email);
            scores.push(Number(list.user_eval[t].rubric_value));
        }

        emails.push("average");
        scores.push(Number(list.average_value));

        console.log(emails);
        console.log(scores);

        return (
            <Bar data={{
                labels: emails,
                datasets: [
                    {
                        label: list.rubric_title,
                        backgroundColor: 'rgba(75,192,192,1)',
                        borderColor: 'rgba(0,0,0,1)',
                        borderWidth: 1,
                        data: scores
                    }
                ]
            }}
                width={30}
                height={20}
                options={{ maintainAspectRatio: true, scales: { yAxes: [{ ticks: { beginAtZero: true } }] } }} />
        )
    }


    render() {
        let assignmentList = this.state.assignmentList;
        console.log(assignmentList);
        let rows = this.state.CSVrows;
        console.log(rows);



        return (
            <div>
                <Typography align={"center"} variant={"subtitle1"} component={"p"} gutterBottom={true}>
                    Download PDF Comming Soon
                </Typography>

                <Button color={'primary'}
                    variant={'contained'}
                    onClick={() => this.props.history.push('/tasks/overview')}>
                    Back to Overview Selection
                </Button>

                <CSVLink data={rows} filename={"groupOverview.csv"}>
                    <Button color={'primary'} variant={'contained'} >
                        Download CSV
                    </Button>
                </CSVLink>

                <Button disabled={true} variant={'contained'}>
                    Download PDF
                </Button>

                <Typography align={"center"} variant={"h4"}>
                    Overview for {this.state.group.name}
                </Typography>

                {assignmentList.map((assignment) => (
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>
                                    <strong>Assignment:</strong> {assignment.name}
                                </TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {assignment.papers.map((paper) => (
                                <ul>
                                    <TableRow>
                                        <TableCell>
                                            <strong>Paper:</strong> {paper.title}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        {paper.assessments.map((assessment) => (
                                            <ul>
                                                <TableRow>
                                                    <TableCell>
                                                        <strong>Rubric:</strong> {assessment.rubric_title}
                                                    </TableCell>
                                                </TableRow>
                                                <ul>
                                                    <TableRow>
                                                        {assessment.user_eval.map((user) => (
                                                            <TableCell style={{ border: "1px black solid" }}>
                                                                {user.email}
                                                            </TableCell>
                                                        ))}
                                                        <TableCell style={{ border: "1px black solid" }}>
                                                            Average
                                                        </TableCell>
                                                    </TableRow>
                                                    <TableRow>
                                                        {assessment.user_eval.map((user) => (
                                                            <TableCell style={{ border: "1px black solid" }}>
                                                                {user.rubric_score}
                                                            </TableCell>
                                                        ))}
                                                        <TableCell style={{ border: "1px black solid" }}>
                                                            {assessment.average_value}
                                                        </TableCell>
                                                    </TableRow>
                                                    {this.createBarGraph(assessment)}
                                                </ul>
                                            </ul>
                                        ))}
                                    </TableRow>
                                </ul>
                            ))}
                        </TableBody>
                    </Table>
                ))
                }
            </div >
        );
    }
}

export default withRouter(OverviewTableGroup);