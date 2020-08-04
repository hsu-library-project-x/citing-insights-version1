import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Button, Typography, Table, TableBody, TableCell, TableHead, TableRow } from '@material-ui/core';
import { CSVLink } from "react-csv";

const columns = [
    { id: 'authors', label: 'Author(s)', minWidth: 100, maxWidth: 120 },
    { id: 'title', label: 'Title', minWidth: 140 },
    {
        id: 'comments',
        label: 'Comments',
        minWidth: 170,
        maxWidth: 200
    },
    {
        id: 'rubricUsed',
        label: 'Rubric Used',
        minWidth: 100,
    },
    {
        id: 'rubricValue',
        label: 'Rubric Value',
        minWidth: 100,
    },
];

class OverviewTable extends Component {
    constructor(props) {
        super(props);

        this.showCitations = this.showCitations.bind(this);
        this.formatCitation = this.formatCitation.bind(this);
        this.getAuthors = this.getAuthors.bind(this);
    };

    componentWillUnmount() {
        this.props.ChangeOverview();
    }

    getAuthors(authors) {
        return authors.map((d) => {
            return d.family + ", " + d.given + "\n"
        });
    }


    formatCitation(citation, assessment) {
        return (
            {
                'author': `${this.getAuthors(citation.author)} ${citation.date}. ${citation.title}`,
                'title': citation.title,
                'comments': assessment.annotation,
                'rubric_title': assessment.rubric_title,
                'rubric_value': assessment.rubric_score,
            }
        );
    }

    showCitations() {
        //Query for Citations where rubric value or annotation is not null
        let data = [];

        if (this.props.citations !== []) {
            this.props.citations.forEach((citation) => {
                if (citation.evaluated === true) { //fetch call also checks this
                    citation.assessments.forEach((assessment => {
                        data.push(this.formatCitation(citation, assessment));
                    }));

                }
            });
        }

        return data;
    }

    render() {
        let rows = this.showCitations();
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

                <CSVLink data={rows} filename={"overview.csv"}>
                    <Button color={'primary'} variant={'contained'} >
                        Download CSV
                    </Button>
                </CSVLink>

                <Button disabled={true} variant={'contained'}>
                    Download PDF
                </Button>

                <Table aria-label="overview table">
                    <TableHead>
                        <TableRow>
                            {columns.map((column) => (
                                <TableCell
                                    key={column.id}
                                    align={column.align}
                                    style={{ minWidth: column.minWidth }}
                                >
                                    {column.label}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map(row => (
                            <TableRow key={row.author}>
                                <TableCell component={"th"} scope={"row"}>
                                    {row.author}
                                </TableCell>
                                <TableCell align={"left"}> {row.title}</TableCell>
                                <TableCell align={"left"}> {row.comments}</TableCell>
                                <TableCell align={"left"}> {row.rubric_title}</TableCell>
                                <TableCell align={"left"}> {row.rubric_value} </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        );
    }
}

export default withRouter(OverviewTable);