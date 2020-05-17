import React, { Component } from 'react';
import userDefaultAvatar from '../../assets/avatars/userDefault.png';
import { connect } from 'react-redux';

class UserRequest extends Component {
  render() {
    const { request } = this.props;

    let avatar;
    if (this.props.security.avatar === '') {
      avatar = (
        <div className='avatar-bg'>
          <img
            src={userDefaultAvatar}
            alt='user-default-avatar'
            className='avatar-image'
          />
        </div>
      );
    } else {
      avatar = (
        <div className='avatar-bg'>
          <img
            src={this.props.security.avatar}
            alt='user-avatar'
            className='avatar-image'
          />
        </div>
      );
    }

    return (
      <div className="flex items-start mb-4 text-sm">
        <img src={userDefaultAvatar} className="w-10 h-10 rounded mr-3" />
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
