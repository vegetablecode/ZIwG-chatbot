import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  getRequests,
  createRequest,
  addTempRequest,
} from '../actions/requestActions';
import { logout, getAvatar } from '../actions/securityActions';
import PropTypes from 'prop-types';
import UserRequest from './Chatbot/UserRequest';
import BotResponse from './Chatbot/BotResponse';
import IdleTimer from 'react-idle-timer';
import EmptyResponse from './Chatbot/EmptyResponse';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowUp } from '@fortawesome/free-solid-svg-icons'
import AvatarNav from './Chatbot/AvatarNav';

class Chatbot extends Component {
  state = {
    question: '',
    message: '',
    getRequestPages: 10,
  };

  onIdle = (e) => {
    this.props.logout();
    window.location.href = '/login';
  };

  getUserRequestsPages = (numbOfPages) => {
    let pages = {
      page: numbOfPages,
    };
    this.props.getRequests(pages);
  };

  loadMoreMessagesAction = () => {
    this.setState((prevState, props) => ({
      getRequestPages: prevState.getRequestPages + 1,
    }));
    this.getUserRequestsPages(this.state.getRequestPages + 1);
  };

  componentDidMount() {
    this.getUserRequestsPages(this.state.getRequestPages);
    this.nameInput.focus();
    // if not logged in redirect to login page
    if (!this.props.security.validToken) {
      window.location.href = '/login';
    }
    // set user avatar (if not set)
    this.props.getAvatar();

    this.scrollToBottom();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }
  }

  componentDidUpdate() {
    this.scrollToBottom();
    // setTimeout(function () {
    //   var messageBody = document.querySelector('#messageBody');
    //   messageBody.scrollTop = messageBody.scrollHeight - messageBody.clientHeight;
    // }, 3000);
  }

  scrollToBottom = () => {
    var messageBody = document.querySelector('#messageBody');
    messageBody.scrollTop = messageBody.scrollHeight - messageBody.clientHeight;
  };

  LoadMoreMessages = () => {
    if (this.messageList.scrollTop === 0) {
      var element = document.getElementById('loader');
      element.classList.add('spinner');
      this.loadMoreMessagesAction();
      setTimeout(function () {
        element.classList.remove('spinner');
      }, 500);
      this.messageList.scrollTop = 1;
    }
  };

  onSubmit = () => {
    // save temp question in redux store
    this.props.addTempRequest(this.state.question);

    // set default number of pages to 0
    this.setState({
      getRequestPages: 0,
    });

    // get response from backend
    const newRequest = {
      question: { query: this.state.question },
    };
    this.props.createRequest(newRequest, this.props.history);
    this.scrollToBottom();
  };

  logout = (e) => {
    this.logout.bind(this);
    window.location.href = '/';
  };

  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  render() {
    const { requests } = this.props.request;
    let length = Object.keys(requests).length;

    let requestList = requests.map((request) => (
      <div key={request.id}>
        <UserRequest request={request} />
        <BotResponse request={request} scrolling={this.scrollToBottom} />
      </div>
    ));

    requestList.unshift(
      <div key='hello'>
        <EmptyResponse />
      </div>
    );

    return (
      <div>
        <IdleTimer
          ref={(ref) => {
            this.idleTimer = ref;
          }}
          element={document}
          onIdle={this.onIdle}
          debounce={250}
          timeout={1000 * 60 * 5}
        />
        <div className="font-sans antialiased h-screen flex">
          {/* Chat content */}
          <div className="flex-1 flex flex-col bg-white overflow-hidden">
            {/* Top bar */}
            <div className="border-b flex px-6 py-2 items-center flex-none">
              <div className="flex flex-col">
                <h3 className="text-grey-darkest mb-1 font-extrabold">ZIwG Chatbot</h3>
                <div className="text-grey-dark text-sm truncate">
                  Don't hesitate to ask me any question!
        </div>
              </div>
              <div className="ml-auto md:block">
                <div className="relative">
                  <AvatarNav />
                </div>
              </div>
            </div>
            {/* Chat messages */}
            <div className="px-6 py-4 flex-1 overflow-y-scroll" id="messageBody">
              {requestList}
            </div>
            <div className="pb-6 px-4 flex-none">
              <div className="flex rounded-lg border-2 border-grey overflow-hidden">
                <input
                  ref={(input) => {
                    this.nameInput = input;
                  }}
                  name='question'
                  id='text'
                  placeholder='Your message'
                  value={this.state.question}
                  onChange={this.onChange}
                  type="text" className="w-full px-4"
                  onKeyPress={event => {
                    if (event.key === 'Enter') {
                      this.onSubmit()
                    }
                  }}
                />
                <span className="text-3xl text-grey border-l-2 border-grey p-2 cursor-pointer" onClick={this.onSubmit}>
                  <FontAwesomeIcon className="h-6 w-6 block" icon={faArrowUp} color="#9babb4" size="xs" />
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Chatbot.propTypes = {
  request: PropTypes.object.isRequired,
  getRequests: PropTypes.func.isRequired,
  createRequest: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
  logout: PropTypes.func.isRequired,
  getAvatar: PropTypes.func.isRequired,
  addTempRequest: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  request: state.request,
  errors: state.errors,
  security: state.security,
});

export default connect(mapStateToProps, {
  getRequests,
  createRequest,
  logout,
  getAvatar,
  addTempRequest,
})(Chatbot);
