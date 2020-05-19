import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import axios from "axios";
import { baseUrl } from "../../config";
import Select from "react-select";
import { Table, Tabs, Icon } from "react-materialize";
import AvatarNav from "../Chatbot/AvatarNav";
import { Button } from 'react-rainbow-components';
import { withRouter } from 'react-router-dom';
import { Tabset, Tab, ButtonGroup, ButtonIcon } from 'react-rainbow-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog, faEllipsisV, faCheck } from '@fortawesome/free-solid-svg-icons';
import styled from 'styled-components';

const StyledTabContent = styled.div`
  background: "#00FF00";
  color: "#00FF00";
  height: 200px;
  border-radius: 0 0 0.875rem 0.875rem;
`;


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
    selected: 'recents'
  };

  handleOnSelect = (event, selected) => {
    this.setState({ selected });
  }

  getTabContent() {
    const { selected } = this.state;

    if (selected === 'primary') {
      return (
        <StyledTabContent
          aria-labelledby="primary"
          id="primaryTab"
          className="text-center"
        >
          <div className="container content-center">
            <Button variant="neutral" className="rainbow-m-around_medium" onClick={() => this.downloadBackup("request")} >
              Download requests
            <FontAwesomeIcon icon={faCheck} style={{ marginLeft: "5" }} />
            </Button>
            <Button variant="neutral" className="rainbow-m-around_medium" onClick={() => this.downloadBackup("users")} >
              Download user data logs
            <FontAwesomeIcon icon={faCheck} style={{ marginLeft: "5" }} />
            </Button>
          </div>
        </StyledTabContent>
      );
    } else if (selected === 'recents') {
      return (
        <StyledTabContent
          aria-labelledby="recents"
          id="recentsTab"
          className="rainbow-p-around_xx-large rainbow-font-size-text_large rainbow-align-text-center"
        >
          Rainbows caused by sunlight always appear in the section of sky directly
          opposite the sun.
        </StyledTabContent>
      );
    } else if (selected === 'shared') {
      return (
        <StyledTabContent
          aria-labelledby="shared"
          id="sharedTab"
          className="rainbow-p-around_xx-large rainbow-font-size-text_large rainbow-align-text-center"
        >
          Rainbows can be full circles. However, the observer normally sees only an arc
          formed by illuminated droplets above the ground, and centered on a line from the
          sun to the observer's eye.
        </StyledTabContent>
      );
    } else if (selected === 'locked') {
      return (
        <StyledTabContent
          aria-labelledby="locked"
          id="lockedTab"
          className="rainbow-p-around_xx-large rainbow-font-size-text_large rainbow-align-text-center"
        >
          Rainbows can be full circles. However, the observer normally sees only an arc
          formed by illuminated droplets above the ground.
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
    // get user list
    axios
      .get(baseUrl + "/api/users/getAllUsernames")
      .then(response => {
        console.log(response);
        this.setState({ usernames: response.data });
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
        console.log(response);
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
                <Button variant="base" label="< chatbot" onClick={() => this.props.history.push("/chatbot")} />
                <AvatarNav />
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
                label="USERS"
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
              <Tab label="INTEGRATIONS" name="shared" id="shared" ariaControls="sharedTab" />
            </Tabset>
            {this.getTabContent()}
          </div>
          <div className="container">
            <br />
            <br />
            <h1 className="header center blue-text text-darken-4">
              Admin Dashboard
          </h1>
            <div className="container">
              <div className="row center">
                <h5 className="header col s12 light">Download backup file.</h5>
                <div className="row">

                </div>
              </div>
            </div>
            <div className="container">
              <div className="row center">
                <h5 className="header col s12 light">Add admin rights.</h5>
                <div>
                  <div>
                    <Select
                      value={this.state.selectedOption}
                      onChange={this.handleChange}
                      options={options}
                    />
                  </div>
                  {adminAddedMessage}
                </div>
              </div>
            </div>
            <div className="container">
              <div className="row center">
                <h5 className="header col s12 light">
                  Recent negative rated responses
              </h5>
                <div>
                  <div>
                    <Tabs className="tab-demo z-depth-1">
                      <Tab title="Negative rated">
                        <Table>
                          <thead>
                            <tr>
                              <th data-field="id">Request ID</th>
                              <th data-field="username">User</th>
                              <th data-field="query">Query</th>
                              <th data-field="intent">Intent</th>
                            </tr>
                          </thead>
                          <tbody>
                            {this.state.negativeRatedResponses.map(request => (
                              <tr key={request.id}>
                                <td>{request.id}</td>
                                <td>{request.requestOwner}</td>
                                <td>{request.question.query}</td>
                                <td>{request.question.intent}</td>
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                      </Tab>
                      <Tab title="Positive rated" active>
                        <Table>
                          <thead>
                            <tr>
                              <th data-field="id">Request ID</th>
                              <th data-field="username">User</th>
                              <th data-field="query">Query</th>
                              <th data-field="intent">Intent</th>
                            </tr>
                          </thead>
                          <tbody>
                            {this.state.positiveRatedResponses.map(request => (
                              <tr key={request.id}>
                                <td>{request.id}</td>
                                <td>{request.requestOwner}</td>
                                <td>{request.question.query}</td>
                                <td>{request.conversation.intent}</td>
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                      </Tab>
                    </Tabs>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div></div> : <div>loading...</div>
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
