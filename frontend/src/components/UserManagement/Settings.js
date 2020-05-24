import React, { Component } from "react";
import { ImagePicker } from "react-file-picker";
import { setAvatar } from "../../actions/securityActions";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Tabset, Tab, ButtonGroup, ButtonIcon } from 'react-rainbow-components';
import { Button, FileSelector } from 'react-rainbow-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload } from '@fortawesome/free-solid-svg-icons';
import styled from 'styled-components';

const StyledTabContent = styled.div`
  background: "#00FF00";
  color: "#00FF00";
  height: 200px;
  border-radius: 0 0 0.875rem 0.875rem;
`;

class Settings extends Component {
  state = {
    showErrorMessage: false,
    errorMessage: "",
    imageLoadedSuccessfully: false,
    selected: 'primary'
  };

  handleBase64 = base64 => {
    const avatarImg = {
      image: base64
    };
    this.props.setAvatar(avatarImg);
    this.setState({
      showErrorMessage: false,
      errorMessage: "",
      imageLoadedSuccessfully: true
    });
    window.location.reload();
  };

  displayErrorMessage = errMsg => {
    this.setState({
      showErrorMessage: true,
      errorMessage: errMsg,
      imageLoadedSuccessfully: false
    });
  };

  handleChange = files => {
    console.log("seting")
  }

  handleOnSelect = (event, selected) => {
    this.setState({ selected });
  }

  getTabContent(errorMessage, imageLoadedMessage) {
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
              Set avatar
            </label>
            <label className="block text-gray-700 text-sm mb-2">
              Upload your awesome avatar
            </label>
            <ImagePicker
              extensions={["jpg", "jpeg", "png"]}
              dims={{
                minWidth: 100,
                maxWidth: 1000,
                minHeight: 100,
                maxHeight: 1000
              }}
              onChange={base64 => this.handleBase64(base64)}
              onError={errMsg => this.displayErrorMessage(errMsg)}
            >
              <Button variant="neutral" className="block" >
                Upload
              <FontAwesomeIcon icon={faUpload} style={{ marginLeft: "5" }} />
              </Button>
            </ImagePicker>
            {imageLoadedMessage}
            {errorMessage}
          </div>
        </StyledTabContent>
      );
    } else if (selected === 'locked') {
      return (
        <StyledTabContent
          aria-labelledby="locked"
          id="lockedTab"
          className="w-full max-w-md pt-5 pl-5"
        >
          Set password form
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

  render() {
    let errorMessage;
    if (this.state.showErrorMessage === true) {
      errorMessage = (
        <p className="text-red-500 text-xs italic">{this.state.errorMessage}</p>
      );
    } else {
      errorMessage = "";
    }

    let imageLoadedMessage;
    if (this.state.imageLoadedSuccessfully === true) {
      imageLoadedMessage = (
        <p className="text-green-500 text-xs italic">
          Image has been loaded successfully!
        </p>
      );
    }

    const { selected } = this.state;

    return (
      <div className="section no-pad-bot" id="index-banner">
        <div>
          <div className="border-b flex px-6 py-2 items-center flex-none">
            <div className="flex flex-col">
              <h3 className="text-grey-darkest mb-1 font-extrabold">Settings</h3>
              <div className="text-grey-dark text-sm truncate">
                Set what you want!
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
                label="SET AVATAR"
                name="primary"
                id="primary"
                ariaControls="primaryTab"
              />

              <Tab
                label="CHANGE PASSWORD"
                name="locked"
                id="locked"
                ariaControls="lockedTab"
              />
            </Tabset>
            {this.getTabContent(errorMessage, imageLoadedMessage)}
          </div></div></div>
    );
  }
}

Settings.propTypes = {
  errors: PropTypes.object.isRequired,
  setAvatar: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  errors: state.errors,
  security: state.security
});

export default connect(
  mapStateToProps,
  { setAvatar }
)(Settings);
