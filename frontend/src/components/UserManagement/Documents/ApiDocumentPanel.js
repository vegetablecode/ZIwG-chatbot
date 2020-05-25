
import React, { Component } from 'react';
import { Column, TableWithBrowserPagination, Button, ButtonMenu, MenuItem } from 'react-rainbow-components';
import axios from "axios";
import { baseUrl } from "../../../config";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFile } from '@fortawesome/free-solid-svg-icons'
import { withRouter } from 'react-router-dom';


class ApiDocumentPanel extends Component {
    state = {
        documents: []
    }

    getData = () => {
        axios
            .get(baseUrl + "/api/document/getAllDocuments")
            .then(response => {
                console.log(response);
                this.setState({
                    documents: response.data.map(document => {
                        let newDocument = document;
                        newDocument.keywords = newDocument.keywords.split(' ').join(', ');
                        return newDocument;
                    })
                });
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    componentDidMount() {
        this.getData();
    }

    openEditMode = (value) => {
        const documentType = this.state.documents.filter(i => i.id === value)[0].type;
        if (documentType === 'API') {
            this.props.history.push("/apiedit/" + value);
        } else if (documentType === 'ZAPIER') {
            this.props.history.push('/zapieredit/' + value);
        }
    }

    removeDocument = value => {
        axios
            .delete(baseUrl + `/api/document/removeDocument/${value}`)
            .then(response => {
                console.log(response);
                this.getData();
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    editButton = ({ value }) => (
        <React.Fragment>
            <Button className="my-1 mr-1" variant="base" onClick={() => this.openEditMode(value)}>edit</Button>
            <Button className="my-1 mr-1" style={{ color: "#c53030" }} variant="base" onClick={() => this.removeDocument(value)}>remove</Button>
        </React.Fragment>
    );

    render() {
        return (
            <React.Fragment>
                <div className="mb-5">
                    <div className="flex justify-between items-center">
                        <div>
                            <label className="block text-gray-900 text-xl font-bold">
                                Active documents
                            </label>
                            <label className="block text-gray-700 text-sm mb-2">
                                Browse all documents added to chatbot
                            </label>
                        </div>
                        <ButtonMenu
                            menuAlignment="right"
                            menuSize="x-small"
                            buttonVariant="brand"
                            icon={<FontAwesomeIcon size="large" icon={faFile} />}
                        >
                            <MenuItem label="REST API" onClick={() => this.props.history.push("/apiedit/" + "new")} />
                            <MenuItem label="ZAPIER" onClick={() => this.props.history.push("/zapieredit/" + "new")} />
                        </ButtonMenu>
                    </div>
                    <TableWithBrowserPagination pageSize={5} data={this.state.documents} keyField="id">
                        <Column header="Id" field="id" />
                        <Column header="Keywords" field="keywords" />
                        <Column header="Type" field="type" />
                        <Column header="Actions" field="id" component={this.editButton} />
                    </TableWithBrowserPagination>
                </div>
            </React.Fragment>
        )
    }
}

export default withRouter(ApiDocumentPanel);