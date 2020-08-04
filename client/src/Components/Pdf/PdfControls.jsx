import React, { Component } from "react";
import { Document, Outline, pdfjs, Page } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "./pdfComponent.css";

pdfjs.GlobalWorkerOptions.workerSrc =
    `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

class PdfControls extends Component {
    constructor(props) {
        super(props);
        this.state = {
            numPages: null,
            rawText: [{}]
        };
    }
    onDocumentLoadSuccess = (document) => {
        const { numPages } = document;
        this.setState({numPages});

    };
    getLayers(items, pageNum) {
        this.setState(prevState => ({
            rawText: {                   // object that we want to update
                ...prevState.rawText,    // keep all other key-value pairs
                [pageNum]: items       // update the value of specific key
            }
        }), () => this.props.PassUpText(this.state.rawText, pageNum));
    }

    renderLoader() {
        return "";
    }

    render() {
        const { numPages } = this.props;
        return (
            <div className="hide-pdf">
                {Array.from(
                    new Array(numPages),
                    (el, index) => (
                        <Page
                            loading={""}
                            onGetTextSuccess={(items) => this.getLayers(items, index + 1)}
                            key={`page_${index + 1}`}
                            pageNumber={index + 1}
                        />
                    ),
                )}
            </div>
        );
    }
}

export default PdfControls;