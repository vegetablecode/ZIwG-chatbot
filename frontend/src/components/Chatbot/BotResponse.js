import React, { Component } from "react";
import ExternalAPIResponse from "./ExternalAPIResponse";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { rateResponse } from "../../actions/requestActions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsDown, faThumbsUp } from "@fortawesome/free-solid-svg-icons";
import watsonAvatar from "../../assets/avatars/watson.png";

class BotResponse extends Component {
  state = {
    response: {
      rating: ""
    },
    classButtonUp: "btn-floating btn blue",
    classButtonDown: "btn-floating btn red"
  };

  handleBtnClick = id => {
    var ratingNumb = id === "liked" ? 1 : -1;
    var rating = {
      id: this.props.request.id,
      username: this.props.request.requestOwner,
      rating: ratingNumb
    };
    this.props.rateResponse(rating);
  };

  createMarkup = msg => {
    return { __html: msg };
  };

  handleImageLoaded() {
    console.log("IMAGE IS LIVE");
  }

  render() {
    const avatar = (
      <div className="avatar-bg">
        <img src={watsonAvatar} alt="watson-avatar" className="avatar-image" />
      </div>
    );

    const { request } = this.props;
    const externalAPIResponse = request.response.type ? (
      <ExternalAPIResponse request={request} scrolling={this.props.scrolling} />
    ) : (
        ""
      );
    const responseText = request.response.message;
    const responseDate = request.date;

    let myElement = "";

    // like button colors
    let thumbUpClass = "";
    let thumbDownClass = "";
    if (request.response.rating === "0") {
      // no rating
      thumbUpClass = "btn-floating btn green";
      thumbDownClass = "btn-floating btn red"
    } else if (request.response.rating === "1") {
      // thumb up
      thumbUpClass = "btn-floating btn green";
      thumbDownClass = "btn-floating btn grey"
    } else {
      // thumb down
      thumbUpClass = "btn-floating btn grey";
      thumbDownClass = "btn-floating btn red"
    }

    let data;
    if (request.response.message === "") {
      data = (
        <div className="flex items-start mb-4 text-sm">
          <img src={watsonAvatar} className="w-10 h-10 rounded mr-3" />
          <div className="flex-1 overflow-hidden">
            <div>
              <span className="font-bold">Chatbot</span>
              <span className="text-grey text-xs"> ..:..</span>
            </div>
            <p className="text-black leading-normal">
              Chatbot is thinking...
        </p>
            <div id="wave">
              <span className="dot" />
              <span className="dot" />
              <span className="dot" />
            </div>
          </div>
        </div>
      );
    } else {
      data = (
        <div className="flex items-start mb-4 text-sm">
          <img src={watsonAvatar} className="w-10 h-10 rounded mr-3" />
          <div className="flex-1 overflow-hidden">
            <div>
              <span className="font-bold">Chatbot</span>
              <span className="text-grey text-xs"> {responseDate}</span>
            </div>
            <div className="text-black leading-normal"
              dangerouslySetInnerHTML={this.createMarkup(responseText)}
            />
            <div>{externalAPIResponse}</div>
            <div>
              <button
                onClick={(e) => {
                  this.handleBtnClick("liked");
                  e.preventDefault()
                }}
                className={thumbUpClass}
                id={request.id}
              >
                <FontAwesomeIcon icon={faThumbsUp} />
              </button>
              <button
                onClick={() => this.handleBtnClick("disliked")}
                className={thumbDownClass}
              >
                <FontAwesomeIcon icon={faThumbsDown} />
              </button>
            </div>
          </div>
        </div>
      );
    }

    return <div>{data}</div>;
  }
}

BotResponse.propTypes = {
  rateResponse: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { rateResponse }
)(BotResponse);
