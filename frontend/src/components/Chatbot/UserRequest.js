import React, { Component } from 'react';
import userDefaultAvatar from '../../assets/avatars/userDefault.png';
import { connect } from 'react-redux';

class UserRequest extends Component {
  render() {
    const { request } = this.props;

    let avatar;
    if (this.props.security.avatar === '') {
      avatar = userDefaultAvatar;
    } else {
      avatar = this.props.security.avatar;
    }

    return (
      <div className="flex items-start mb-4 text-sm">
        <img src={avatar} className="w-10 h-10 rounded mr-3" />
        <div className="flex-1 overflow-hidden">
          <div>
            <span className="font-bold">User</span>
            <span className="text-grey text-xs"> {request.date}</span>
          </div>
          <p className="text-black leading-normal">
            {request.question.query}
          </p>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  errors: state.errors,
  security: state.security,
});

export default connect(mapStateToProps, null)(UserRequest);
