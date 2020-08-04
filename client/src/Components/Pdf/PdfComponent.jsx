import React, { forwardRef, PureComponent } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { FixedSizeGrid } from "react-window";
import { TextField, Toolbar, InputAdornment, IconButton, Tooltip, AppBar, Button } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search'
import ZoomInIcon from '@material-ui/icons/ZoomIn';
import ZoomOutIcon from '@material-ui/icons/ZoomOut';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';

import "react-pdf/dist/Page/AnnotationLayer.css";
import "./pdfComponent.css";

pdfjs.GlobalWorkerOptions.workerSrc =
    `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;


class PdfComponent extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            numPages: null,
            pageNumber: this.props.pageNumber,
            searchText: '',
            pdf: new Blob([this.props.data], { type: "application/pdf;base64" }),
            scale: 1.0,
            columnWidth: window.innerWidth / 1.5,
            rowHeight: 1.5 * window.innerHeight,
            rawText: [],
            matches: [],
            loadedPage: 1,
            currentMatch: null,
            checked:false

        };

        this.ZoomIn = this.ZoomIn.bind(this);
        this.ZoomOut = this.ZoomOut.bind(this);
        this.ScrollTo = this.ScrollTo.bind(this);
        this.SearchScroll = this.SearchScroll.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.Search = this.Search.bind(this);
        this.PassUpText = this.PassUpText.bind(this);

        this.windowHeight = window.innerHeight;
        this.windowWidth = window.innerWidth / 1.5;

        this.GUTTER_SIZE = 5;
        this.gridRef = React.createRef();
        this.markRef = React.createRef();
        this.scrollableContainerRef = React.createRef();
    }




    removeTextLayerOffset() {
        const textLayers = document.querySelectorAll(".react-pdf__Page__textContent");
        textLayers.forEach(layer => {
            const { style } = layer;
            style.top = "0";
            style.left = "0";
            style.transform = "";
            style.margin = "auto";
        });
    }

    PassUpText(rawText, num) {
        let that = this;
        that.setState(({
            rawText: rawText,
            pageNumber: num,
        }));
    };

    componentWillReceiveProps(nextProps) {

        let bytes = new Uint8Array(nextProps.data);
        let blob = new Blob([bytes], { type: "application/pdf;base64" });
        this.setState({
            pdf: blob
        });

    }

    componentWillUnmount() {
        console.log('unmounting pdf');
    }

    onDocumentLoadSuccess = (nPages) => {
        if (this.state.pageNumber == null) {
            this.setState({
                numPages: nPages,
                pageNumber: 1,
            });
        } else if (this.state.pageNumber > nPages) {
            this.setState({
                numPages: nPages,
                pageNumber: nPages - 1,
            })
        } else {
            this.setState({
                pageNumber: nPages,
                numPages: nPages
            });
        }
    };



    calculateAlignment(){
        let offset = this.state.matches[this.state.currentMatch - 1][2];
        let alignment = '';
        if(offset < 6){
            alignment = 'start';
        }
        else if(offset < 10){
            alignment = 'smart';
        }
        else if(offset >= 10){
            alignment = 'end';
        }
        return alignment;
    }

    SearchScroll() {

        let that = this;
        let match = this.state.matches[this.state.currentMatch - 1];
        if (match !== undefined) {
                that.gridRef.current.scrollToItem({
                    behavior: 'smooth',
                    inline: 'smart',
                    align: this.calculateAlignment(),
                    columnIndex: 1,
                    rowIndex: match[1]
                });
            }

    }

    Search(subject) {
        let matches = [];
        let current = null;
        //Remove anything thats not a word of chars or whitespace
        let newString = subject.replace(/[^\w\s]/, "");
        newString = newString.replace(/\\/g, "");
        let regexp = new RegExp(newString, 'gi');
        if (newString !== "") {
            //for every page
            for (let k = 0; k < this.props.rawText.length; k++) {
                //for every line
                for (let i = 0; i < this.props.rawText[k].length; i++) {
                    //if the string(line) has a match, push that string.
                    if (this.props.rawText[k][i][0].match(regexp)) {
                        //find the number of times regex appears in string
                        let numOccurances = (this.props.rawText[k][i][0].match(regexp) || []).length;
                        for(let j=0; j < numOccurances; j++){
                            // string, page, line, lineIndex, number of occurances
                            matches.push([this.props.rawText[k][i][0], k, i, j, numOccurances]);
                        }
                    }
                }
            }
            if (matches.length >= 1) {
                current = 1;
            }
        }


        this.setState({
            matches: matches,
            currentMatch: current,
        }, () => this.SearchScroll());

        return matches;
    };

    // call when input changes to update the state
    handleInputChange(event) {
        const target = event.target;
        const value = target.value.replace(/[^\w\s]/, "");
        const name = target.name;

        this.setState({ [name]: value });
    }

    PreviousResult() {
        this.setState((prevState) => ({
            currentMatch: prevState.currentMatch - 1
        }), () => this.SearchScroll());
    }

    NextResult() {
        this.setState((prevState) => ({
            currentMatch: prevState.currentMatch + 1
        }), () =>this.SearchScroll());
    }

    ZoomIn() {
        let offset = 0.25;

        this.setState((prevState) => ({
            columnWidth: prevState.columnWidth + (prevState.columnWidth * offset),
            rowHeight: prevState.rowHeight + (prevState.rowHeight * offset),
        }));
    }

    ZoomOut() {
        let offset = -0.25;

        this.setState((prevState) => ({
            columnWidth: prevState.columnWidth + (prevState.columnWidth * offset),
            rowHeight: prevState.rowHeight + (prevState.rowHeight * offset),
        }));
    }

    ScrollTo(event) {
        event.preventDefault();
        let that = this;
        let page = event.target.value;
        that.gridRef.current.scrollToItem({
            behavior: 'smooth',
            inline: 'nearest',
            align: "smart",
            columnIndex: 1,
            rowIndex: page -1 ,
        });
    }


    GenerateGrid = () => {

        const innerElementType = forwardRef(({ style, ...rest }, ref) => (
            <div
                id="contDiv"
                ref={ref}
                style={{
                    ...style,
                    paddingLeft: this.GUTTER_SIZE,
                    paddingTop: this.GUTTER_SIZE,
                    marginBottom: this.GUTTER_SIZE,
                }}
                {...rest}
            />
        ));

        const Cell = ({ columnIndex, data, rowIndex, style }) => (
            <div
                ref={ el => this.container = el}
                id="containerDiv"
                className={"GridItem"}
                style={{
                    ...style,
                    left: ((this.windowWidth - this.state.columnWidth) / 2) + this.GUTTER_SIZE,
                    top: style.top + this.GUTTER_SIZE,
                    width: style.width - this.GUTTER_SIZE,
                    height: style.height - this.GUTTER_SIZE,

                }}
            >
                <Page
                    customTextRenderer={({ str, itemIndex }) =>{
                            let newString = this.state.searchText.replace(/[^\w\s]/, "");
                            newString = newString.replace(/\\/g, "");

                            let regexp = new RegExp(newString, 'gi');

                            const splitText = str.split(regexp);

                            if (splitText.length <= 1) {
                                return str;
                            }

                            const matches = str.match(regexp);


                            let curMatch = this.state.matches[this.state.currentMatch  -1];
                            let curPage, curLineIndex;
                            

                            if (curMatch) {
                                 curPage = curMatch[1];
                                 curLineIndex = curMatch[3];

                            }

                            return splitText.reduce((arr, element, index) =>
                                (
                                    matches[index] ? [
                                        ...arr,
                                        element,
                                        <mark ref={this.markRef} key={index}
                                              style={{backgroundColor:
                                                      (index === curLineIndex) &&  (curPage === rowIndex)
                                                          ? 'orange':'yellow'}}>
                                                                                        {matches[index]}
                                        </mark>,
                                    ] : [...arr, element]), []);
                        }
                    }
                    onLoadSuccess={() => this.removeTextLayerOffset()}
                    height={this.state.rowHeight}
                    key={`page_${rowIndex + 1}`}
                    pageNumber={rowIndex + 1}
                    className="pdf-viewer"
                    scale={1.0}
                />
            </div>
        );

        return (
            <FixedSizeGrid
                id="Grid"
                style={{ justifyContent: 'center', alignContent: 'center' }}
                className="Grid"
                columnCount={1}
                columnWidth={this.state.columnWidth + this.GUTTER_SIZE}
                height={this.windowHeight}
                innerElementType={innerElementType}
                rowCount={this.state.numPages}
                rowHeight={this.state.rowHeight + this.GUTTER_SIZE}
                width={this.windowWidth}
                ref={this.gridRef}
                outerRef={this.scrollableContainerRef}
                onScroll={this.onScroll}
            >
                {Cell}
            </FixedSizeGrid>
        );
    };


    render() {

        return (
            <div className="document-wrapper">
                {/*<Container maxWidth="md">*/}
                <AppBar color={'transparent'} position="sticky" className={'pdf-ToolBar'}>
                    <Toolbar className={'pdf-ToolBar'} disableGutters={true}>
                        <TextField
                            name={'searchText'}
                            onChange={this.handleInputChange}
                            placeholder={"search"}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon />
                                    </InputAdornment>
                                ),
                                endAdornment:(
                                    <Button size={'small'} variant='contained' color={'primary'} aria-label={'search'}
                                            onClick={()=> this.Search(this.state.searchText)}>
                                        Search
                                    </Button>
                                )
                            }}

                        />

                        <p> {this.state.currentMatch ? this.state.currentMatch + " of " : null}
                        {` ${this.state.matches.length} matches`}</p>


                        <Tooltip title="Previous">
                            <IconButton
                                aria-label="previous-search-result"
                                color="primary"
                                disabled={this.state.currentMatch <= 1}
                                onClick={() => this.PreviousResult()}>
                                <NavigateBeforeIcon />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Next">
                            <IconButton
                                aria-label="next-search-result"
                                color="primary"
                                disabled={this.state.currentMatch >= this.state.matches.length}
                                onClick={() => this.NextResult()}>
                                <NavigateNextIcon />
                            </IconButton>
                        </Tooltip>
                        <p> Go to Page </p>
                        <TextField
                            onChange={this.ScrollTo}
                            aria-label="Page Number"
                            type="number"
                            defaultValue={1}
                            size={'small'}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            InputProps={{
                                inputProps: {
                                    max: this.state.numPages,
                                    min: 1
                                }
                            }}
                        />
                        <p> of {this.state.numPages} </p>
                        <Tooltip title="Zoom Out">
                            <IconButton aria-label="zoom-out" color="primary" onClick={this.ZoomOut}>
                                <ZoomOutIcon />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Zoom In">
                            <IconButton aria-label="zoom-in" color="primary" onClick={this.ZoomIn}>
                                <ZoomInIcon />
                            </IconButton>
                        </Tooltip>
                    </Toolbar>
                </AppBar>
                {/*</Container>*/}
                <Document
                    file={this.state.pdf}
                    onLoadSuccess={(pdf) => {
                        this.onDocumentLoadSuccess(pdf.numPages)
                    }}
                    className="pdf-container"
                    error={"Loading may take a few seconds...."}
                >
                        {this.GenerateGrid()}
                        {/*pdf controls is not shown with a css display:hidden eventually I need to make mode efficiant*/}
                </Document>


            </div>
        );
    }
}

function PdfPropsAreEqual(prevProps, nextProps) {
    return prevProps.data === nextProps.data
        && prevProps.pageNumber === nextProps.pageNumber;
}

//Wrapping the component in a memo lets us check against a memoized version -- eliminating unneccessary rerenders
export default React.memo(PdfComponent, PdfPropsAreEqual);
