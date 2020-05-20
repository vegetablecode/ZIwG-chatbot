import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import axios from "axios";
import { baseUrl } from "../../config";
import Select from "react-select";
import { Table, Tabs, Icon } from "react-materialize";
import AvatarNav from "../Chatbot/AvatarNav";
import { withRouter } from 'react-router-dom';
import { Tabset, Tab, ButtonGroup, ButtonIcon } from 'react-rainbow-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import styled from 'styled-components';
import { Button, Column, Badge, TableWithBrowserPagination, RadioButtonGroup } from 'react-rainbow-components';

const StyledTabContent = styled.div`
  background: "#00FF00";
  color: "#00FF00";
  height: 200px;
  border-radius: 0 0 0.875rem 0.875rem;
`;

const StyledBadge = styled(Badge)`
    color: #1de9b6;
`;

const StatusBadge = ({ value }) => <StyledBadge label={value ? "Yes" : "No"} variant="lightest" />;

const values = [
  { value: 'negative', label: 'Negative' },
  { value: 'positive', label: 'Positive' }
];

class Dashboard extends Component {
  state = {
    usernames: {},
    selectedOption: null,
    adminAdded: false,
    adminAddedResponse: "",
    negativeRatedResponses: [],
    positiveRatedResponses: [],
    backupFile: "",
    isMounted: false,
    selected: 'recents',
    userDetails: [],
    showPositive: false,
    statusToShow: 'negative'
  };

  handleOnSelect = (event, selected) => {
    this.setState({ selected });
  }

  parseCreatedAt = (d) => {
    const date = new Date(d);
    const dateTimeFormat = new Intl.DateTimeFormat('en', { year: 'numeric', month: 'short', day: '2-digit' });
    const [{ value: month }, , { value: day }, , { value: year }] = dateTimeFormat.formatToParts(date);
    return `${day} ${month} ${year}`;
  }

  getTabContent(options, adminAddedMessage) {
    const { selected } = this.state;

    if (selected === 'primary') {
      return (
        <StyledTabContent
          aria-labelledby="primary"
          id="primaryTab"
          className="w-full max-w-md pt-5 pl-5"
        >
          <div className="mb-5">
            <label className="block text-gray-900 text-xl font-bold">
              Download requests
            </label>
            <label className="block text-gray-700 text-sm mb-2">
              Download all requests as a JSON log
            </label>
            <div>
              <Button variant="neutral" className="block" onClick={() => this.downloadBackup("request")} >
                Download
              <FontAwesomeIcon icon={faDownload} style={{ marginLeft: "5" }} />
              </Button>
            </div>
          </div>
          <div className="mb-5">
            <label className="block text-gray-900 text-xl font-bold">
              Download user data
            </label>
            <label className="block text-gray-700 text-sm mb-2">
              Download all user data as a JSON log
            </label>
            <div>
              <Button variant="neutral" className="block" onClick={() => this.downloadBackup("users")} >
                Download
              <FontAwesomeIcon icon={faDownload} style={{ marginLeft: "5" }} />
              </Button>
            </div>
          </div>
        </StyledTabContent>
      );
    } else if (selected === 'recents') {
      return (
        <StyledTabContent
          aria-labelledby="recents"
          id="recentsTab"
          className="w-full pt-5 pl-5 pr-5"
        >
          <div className="mb-5">
            <label className="block text-gray-900 text-xl font-bold">
              Rated Answers
            </label>
            <label className="block text-gray-700 text-sm mb-2">
              Browse rated chatbot answers
            </label>
            <RadioButtonGroup
              className="mb-5"
              options={values}
              value={this.state.statusToShow}
              variant="brand"
              onChange={(e) => this.setState({ statusToShow: e.target.value })}
            />
            <TableWithBrowserPagination pageSize={5} data={this.state.statusToShow === 'negative' ? this.state.negativeRatedResponses : this.state.positiveRatedResponses} keyField="id">
              <Column header="User" field="id" />
              <Column header="Question" field="question.query" />
              <Column header="Intent" field="conversation.intent" />
              <Column header="Response" field="response.message" />
              <Column header="Request ID" field="response.message" />
            </TableWithBrowserPagination>
          </div>
        </StyledTabContent>
      );
    } else if (selected === 'shared') {
      return (
        <StyledTabContent
          aria-labelledby="shared"
          id="sharedTab"
          className="w-full pt-5 pl-5 pr-5"
        >
          <div className="mb-5">
            <label className="block text-gray-900 text-xl font-bold">
              Attach user rights
            </label>
            <label className="block text-gray-700 text-sm mb-2">
              Choose a user from list and give them admin rights
            </label>
            <div>
              <Select
                value={this.state.selectedOption}
                onChange={this.handleChange}
                options={options}
              />
              <p className="text-green-500 text-xs italic">
                {adminAddedMessage}
              </p>
            </div>
          </div>
          <div className="mb-5">
            <label className="block text-gray-900 text-xl font-bold">
              Browse users
            </label>
            <label className="block text-gray-700 text-sm mb-2">
              Browse chabot users
            </label>
            <TableWithBrowserPagination pageSize={5} data={this.state.userDetails} keyField="id">
              <Column header="E-mail" field="username" />
              <Column header="Admin" field="isAdmin" component={StatusBadge} />
              <Column header="Full Name" field="fullName" />
              <Column header="Created at" field="created_At" />
            </TableWithBrowserPagination>
          </div>
        </StyledTabContent>
      );
    } else if (selected === 'locked') {
      return (
        <StyledTabContent
          aria-labelledby="locked"
          id="lockedTab"
          className="rainbow-p-around_xx-large rainbow-font-size-text_large rainbow-align-text-center"
        >
          Integrations here
        </StyledTabContent>
      );
    }
    return (
      <StyledTabContent
        aria-labelledby="forums"
        id="forumsTab"
        className="rainbow-p-around_xx-large rainbow-font-size-text_large rainbow-align-text-center"
      >
        In a primary rainbow, the arc shows red on the outer part and violet on the inner
        side. This rainbow is caused by light being refracted when entering a droplet of
        water.
      </StyledTabContent>
    );
  }

  componentDidMount() {
    // get user details
    axios
      .get(baseUrl + "/api/users/getAllUsernames")
      .then(response => {
        console.log(response);
        this.setState({
          usernames: response.data
        });
      })
      .catch(function (error) {
        console.log(error);
      });

    // get user list
    axios
      .get(baseUrl + "/api/users/getAllUserDetails")
      .then(response => {
        this.setState({
          userDetails: response.data.map(user => {
            let newUser = user;
            newUser.created_At = this.parseCreatedAt(user.created_At);
            return newUser;
          })
        });
      })
      .catch(function (error) {
        console.log(error);
      });

    // get negative & positive rated responses
    const posRating = { rating: "1" };
    const negRating = { rating: "-1" };
    axios
      .post(baseUrl + "/api/request/getRatedRequests", posRating)
      .then(response => {
        this.setState({ positiveRatedResponses: response.data });
      })
      .catch(function (error) {
        console.log(error);
      });
    axios
      .post(baseUrl + "/api/request/getRatedRequests", negRating)
      .then(response => {
        console.log(response);
        this.setState({ negativeRatedResponses: response.data });
      })
      .catch(function (error) {
        console.log(error);
      });
    this.setState({
      isMounted: true
    })
    console.log("mounted")
  }

  setSelectedUsername = item => {
    console.log(item);
  };

  downloadBackup = type => {
    axios({
      url: baseUrl + "/api/" + type + "/getBackupFile",
      method: "GET",
      responseType: "blob" // important
    }).then(response => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "file.json");
      document.body.appendChild(link);
      link.click();
    });
  };

  handleChange = selectedOption => {
    const toUsername = selectedOption.value;
    const toUser = {
      username: toUsername
    };
    axios
      .post(baseUrl + "/api/users/giveAdmin", toUser)
      .then(response => {
        this.setState({
          adminAddedResponse: response.data.status
        });
      })
      .catch(function (error) {
        this.setState({
          adminAddedResponse: error
        });
      });

    this.setState({ selectedOption });
    this.setState({
      adminAdded: true
    });
  };

  render() {
    const { selected } = this.state;
    console.log(this.state.backupFile);
    let options = [];
    const names = this.state.usernames;

    for (let name in names) {
      let newItem = {
        value: name,
        label: name
      };
      options.push(newItem);
    }

    let adminAddedMessage;
    if (this.state.adminAdded === true && this.state.selectedOption != null) {
      adminAddedMessage = (
        <p className="green-text text-darken-4">
          {this.state.adminAddedResponse}
        </p>
      );
    }

    return (
      this.state.isMounted ? <div className="section no-pad-bot" id="index-banner">
        <div>
          <div className="border-b flex px-6 py-2 items-center flex-none">
            <div className="flex flex-col">
              <h3 className="text-grey-darkest mb-1 font-extrabold">Admin Dashboard</h3>
              <div className="text-grey-dark text-sm truncate">
                Set stuff! You're an admin!
        </div>
            </div>
            <div className="ml-auto md:block">
              <div className="relative">
                <Button variant="base" label="Back to chatbot" onClick={() => this.props.history.push("/chatbot")} />
              </div>
            </div>
          </div>
          <div style={{ paddingBottom: 25, backgroundColor: "#f5f5f5" }}></div>
          <div className="rainbow-flex rainbow-flex_column rainbow_vertical-stretch">
            <Tabset
              style={{ backgroundColor: "#f5f5f5" }}
              id="tabset-1"
              onSelect={this.handleOnSelect}
              activeTabName={selected}
              className="rainbow-p-horizontal_x-large"
            >
              <Tab
                label="BACKUPS & LOGS"
                name="primary"
                id="primary"
                ariaControls="primaryTab"
              />

              <Tab
                label="INTEGRATIONS"
                name="locked"
                id="locked"
                ariaControls="lockedTab"
              />
              <Tab
                label="RATED ANSWERS"
                name="recents"
                id="recents"
                ariaControls="recentsTab"
              />
              <Tab label="USERS" name="shared" id="shared" ariaControls="sharedTab" />
            </Tabset>
            {this.getTabContent(options, adminAddedMessage)}
          </div></div></div>
        : <div>loading...</div>
    );
  }
}

Dashboard.propTypes = {
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  errors: state.errors,
  security: state.security
});

export default connect(
  mapStateToProps,
  null
)(withRouter(Dashboard));
