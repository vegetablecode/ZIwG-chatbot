import React, { Component } from 'react'
import { baseUrl } from "../../../config";
import axios from "axios";
import { Input, Button, ButtonIcon, RadioButtonGroup, Notification } from 'react-rainbow-components';
import { withRouter } from "react-router-dom";
import {
    faTrashAlt,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import AceEditor from "react-ace";

import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/theme-github";

const values = [
    { value: 'GET', label: 'GET' },
    { value: 'POST', label: 'POST' },
    { value: 'PUT', label: 'PUT' },
    { value: 'DELETE', label: 'DELETE' }
];

class ZapierDocumentEdit extends Component {
    state = {
        document: {},
        keywords: "",
        params: [],
        headers: [],
        endpoint: "",
        method: "POST",
        body: "",
        template: "",
        showSuccessAlert: false,
        showWarningAlert: false
    }

    onChange = e => {
        this.setState({ [e.target.name]: e.target.value });
    };

    saveDocument = () => {
        const { match: { params } } = this.props;
        let updatedDocument = {};
        if (params.documentId !== 'new') {
            updatedDocument = {
                id: params.documentId,
                keywords: this.state.keywords.split(', ').join(' '),
                params: this.state.params,
                endpoint: this.state.endpoint,
                method: this.state.method,
                body: this.state.body,
                template: this.state.template,
                type: this.state.document.type
            };
        } else {
            updatedDocument = {
                keywords: this.state.keywords.split(', ').join(' '),
                params: this.state.params,
                endpoint: this.state.endpoint,
                method: this.state.method,
                body: this.state.body,
                template: this.state.template,
                type: "ZAPIER"
            };
        }

        axios.post(baseUrl + `/api/document/addDocument`, updatedDocument)
            .then(response => {
                this.setState({
                    document: response.data,
                    keywords: response.data.keywords.split(' ').join(', '),
                    params: response.data.params,
                    headers: response.data.headers,
                    endpoint: response.data.endpoint,
                    method: response.data.method,
                    body: response.data.body,
                    template: response.data.template,
                    showSuccessAlert: true
                });
            })
            .catch((error) => {
                console.log(error);
                this.setState({
                    showWarningAlert: true
                });
            });
    }

    onParamsLabelChange = idx => evt => {
        const newParams = this.state.params.map((param, sidx) => {
            if (idx !== sidx) return param;
            return { ...param, label: evt.target.value };
        });

        this.setState({ params: newParams });
    };

    onParamsRegexChange = idx => evt => {
        const newParams = this.state.params.map((param, sidx) => {
            if (idx !== sidx) return param;
            return { ...param, regex: evt.target.value };
        });

        this.setState({ params: newParams });
    };

    handleAddParam = () => {
        this.setState({
            params: this.state.params.concat([{ label: "", type: "", regex: "" }])
        });
    };

    handleRemoveParam = idx => () => {
        this.setState({
            params: this.state.params.filter((s, sidx) => idx !== sidx)
        });
    };

    onHeaderKeyChange = idx => evt => {
        const newParams = this.state.headers.map((param, sidx) => {
            if (idx !== sidx) return param;
            return { ...param, key: evt.target.value };
        });

        this.setState({ headers: newParams });
    };

    onHeaderValueChange = idx => evt => {
        const newParams = this.state.headers.map((param, sidx) => {
            if (idx !== sidx) return param;
            return { ...param, value: evt.target.value };
        });

        this.setState({ headers: newParams });
    };

    handleAddHeader = () => {
        this.setState({
            headers: this.state.headers.concat([{ key: "", value: "" }])
        });
    };

    handleRemoveHeader = idx => () => {
        this.setState({
            headers: this.state.headers.filter((s, sidx) => idx !== sidx)
        });
    };

    closeSuccessAlert = () => {
        this.setState({
            showSuccessAlert: false
        })
    };

    closeWarningAlert = () => {
        this.setState({
            showWarningAlert: false
        })
    };

    componentDidMount() {
        const { match: { params } } = this.props;

        if (params.documentId !== 'new') {
            axios.get(baseUrl + `/api/document/getDocument/${params.documentId}`)
                .then(response => {
                    console.log(response);
                    this.setState({
                        document: response.data,
                        keywords: response.data.keywords.split(' ').join(', '),
                        params: response.data.params,
                        headers: response.data.headers,
                        endpoint: response.data.endpoint,
                        method: response.data.method,
                        body: response.data.body,
                        template: response.data.template
                    });
                })
                .catch(function (error) {
                    console.log(error);
                });
        }
    }

    render() {
        return (
            <div className="section no-pad-bot" id="index-banner">
                <div>
                    <div className="border-b flex px-6 py-2 items-center flex-none">
                        <div className="flex flex-col">
                            <h3 className="text-grey-darkest mb-1 font-extrabold">Edit document API</h3>
                            <div className="text-grey-dark text-sm truncate">
                                Edit external API document
                            </div>
                        </div>
                        <div className="ml-auto md:block">
                            <div className="relative">
                                <Button variant="base" label="< to dashboard" onClick={() => this.props.history.push("/dashboard")} />
                            </div>
                        </div>
                    </div>
                    {this.state.showSuccessAlert ? (
                        <div className="fixed top-0 right-0 mt-3 mr-3 z-10" onClick={() => this.closeSuccessAlert()}>
                            <Notification
                                title="Success"
                                description="The document has been successfully updated."
                                icon="success"
                                onRequestClose={() => this.closeSuccessAlert()}
                            />
                        </div>
                    ) : ""}
                    {this.state.showWarningAlert ? (
                        <div className="fixed top-0 right-0 mt-3 mr-3 z-10" onClick={() => this.closeWarningAlert()}>
                            <Notification
                                className="transition duration-200 ease-in transform -translate-y-1"
                                title="Something went wrong..."
                                description="We cannot update the document."
                                icon="error"
                                onRequestClose={() => this.closeWarningAlert()}
                            />
                        </div>
                    ) : ""}
                    <div className="m-5 lg:mx-64">
                        <div className="mb-5">
                            <label className="block text-gray-900 text-xl font-bold">
                                Keywords
                            </label>
                            <label className="block text-gray-700 text-sm mb-2">
                                Set keywords separated by comma
                            </label>
                            <Input
                                id="keywords"
                                name="keywords"
                                placeholder="simple, keywords, just, like, this"
                                className="m-w-xl mt-3"
                                value={this.state.keywords}
                                onChange={this.onChange}
                            />
                        </div>
                        <div className="mb-5">
                            <label className="block text-gray-900 text-xl font-bold">
                                Parameters
                            </label>
                            <label className="block text-gray-700 text-sm mb-2">
                                What params chatbot needs to ask?
                            </label>
                            {this.state.params.map((paramSet, index) => (
                                <div key={index}>
                                    <div className="flex items-end flex-row">
                                        <Input
                                            label="Name"
                                            id="name"
                                            placeholder="ex. weekday"
                                            className="flex-grow mr-2"
                                            value={paramSet.label}
                                            onChange={this.onParamsLabelChange(index)}
                                        />
                                        <Input
                                            label="Regex"
                                            id="regex"
                                            placeholder="ex. [0-9]"
                                            className="flex-grow mr-2"
                                            value={paramSet.regex}
                                            onChange={this.onParamsRegexChange(index)}
                                        />
                                        <ButtonIcon onClick={this.handleRemoveParam(index)} className="flex-grow-0" variant="outline-brand" size="medium" icon={<FontAwesomeIcon icon={faTrashAlt} />} />
                                    </div>
                                </div>
                            ))}
                            <div className="flex justify-center mt-3">
                                <Button className="flex-grow-0" variant="base" onClick={() => this.handleAddParam()}>
                                    + new parameter
                                </Button>
                            </div>
                        </div>
                        <div className="mb-5">
                            <label className="block text-gray-900 text-xl font-bold">
                                Zapier Webhook
                            </label>
                            <label className="block text-gray-700 text-sm mb-2">
                                Set a Zapier webhook that calls your Zap.
                            </label>
                            <Input
                                id="endpoint"
                                name="endpoint"
                                placeholder="http://example.com/api/data"
                                className="m-w-xl mt-3"
                                value={this.state.endpoint}
                                onChange={this.onChange}
                            />
                        </div>
                        <div className="mb-5">
                            <label className="block text-gray-900 text-xl font-bold">
                                Template
                            </label>
                            <label className="block text-gray-700 text-sm mb-2">
                                You can refer to Zapier response elements by putting them in curly brackets. Remember that the root element is called data. You can find more info in official documentation.
                            </label>
                            <AceEditor
                                style={{ width: "100%" }}
                                mode="html"
                                value={this.state.template}
                                onChange={value => this.setState({ template: value })}
                                name="UNIQUE_ID_OF_DIV"
                                editorProps={{ $blockScrolling: true }}
                                fontSize={14}
                                showPrintMargin={true}
                                showGutter={true}
                                highlightActiveLine={true}
                                setOptions={{
                                    enableBasicAutocompletion: true,
                                    enableLiveAutocompletion: true,
                                    enableSnippets: false,
                                    showLineNumbers: true,
                                    tabSize: 2,
                                }}
                            />
                        </div>
                        <div className="flex justify-center mt-3">
                            <Button className="flex-grow-0" variant="brand" onClick={() => this.saveDocument()}>
                                Save document
                            </Button>
                        </div>
                    </div>
                </div></div>
        )
    }
}

export default withRouter(ZapierDocumentEdit);