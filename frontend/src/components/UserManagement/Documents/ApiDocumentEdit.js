import React, { Component } from 'react'
import { baseUrl } from "../../../config";
import axios from "axios";
import { Input, Button, ButtonIcon, RadioButtonGroup } from 'react-rainbow-components';
import { withRouter } from "react-router-dom";
import {
    faTrashAlt,
    faPencilAlt,
    faLocationArrow,
    faArrowDown,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const values = [
    { value: 'GET', label: 'GET' },
    { value: 'POST', label: 'POST' },
    { value: 'PUT', label: 'PUT' },
    { value: 'DELETE', label: 'DELETE' }
];

class ApiDocumentEdit extends Component {
    state = {
        document: {},
        keywords: "",
        params: [],
        headers: [],
        endpoint: "",
        method: ""
    }

    onChange = e => {
        this.setState({ [e.target.name]: e.target.value });
    };

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
            headers: this.state.headers.concat([{ label: "", type: "", regex: "" }])
        });
    };

    handleRemoveHeader = idx => () => {
        this.setState({
            headers: this.state.headers.filter((s, sidx) => idx !== sidx)
        });
    };

    componentDidMount() {
        const { match: { params } } = this.props;

        axios.get(baseUrl + `/api/document/getDocument/${params.documentId}`)
            .then(response => {
                console.log(response);
                this.setState({
                    document: response.data,
                    keywords: response.data.keywords.split(' ').join(', '),
                    params: response.data.params,
                    headers: response.data.headers,
                    endpoint: response.data.endpoint,
                    method: response.data.method
                });
            })
            .catch(function (error) {
                console.log(error);
            });
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
                                Endpoint
                            </label>
                            <label className="block text-gray-700 text-sm mb-2">
                                Set url of the HTTP request
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
                                Method
                            </label>
                            <label className="block text-gray-700 text-sm mb-2">
                                Select HTTP method
                            </label>
                            <div className="flex justify-center mt-3">
                                <RadioButtonGroup
                                    className="flex-grow-0"
                                    options={values}
                                    value={this.state.method}
                                    variant="brand"
                                    onChange={(e) => this.setState({ method: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="mb-5">
                            <label className="block text-gray-900 text-xl font-bold">
                                Headers
                            </label>
                            <label className="block text-gray-700 text-sm mb-2">
                                All request headers go here...
                            </label>
                            {this.state.headers.map((paramSet, index) => (
                                <div key={index}>
                                    <div className="flex items-end flex-row">
                                        <Input
                                            label="Key"
                                            id="key"
                                            placeholder="ex. content-type"
                                            className="flex-grow mr-2"
                                            value={paramSet.key}
                                            onChange={this.onHeaderKeyChange(index)}
                                        />
                                        <Input
                                            label="Value"
                                            id="value"
                                            placeholder="ex. application/x-www-form-urlencoded"
                                            className="flex-grow mr-2"
                                            value={paramSet.value}
                                            onChange={this.onHeaderValueChange(index)}
                                        />
                                        <ButtonIcon onClick={this.handleRemoveHeader(index)} className="flex-grow-0" variant="outline-brand" size="medium" icon={<FontAwesomeIcon icon={faTrashAlt} />} />
                                    </div>
                                </div>
                            ))}
                            <div className="flex justify-center mt-3">
                                <Button className="flex-grow-0" variant="base" onClick={() => this.handleAddHeader()}>
                                    + new header
                                </Button>
                            </div>
                        </div>
                    </div>
                </div></div>
        )
    }
}

export default withRouter(ApiDocumentEdit);