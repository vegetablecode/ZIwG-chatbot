import React, { Component } from "react";
import watsonAvatar from "../../assets/avatars/watson.png";

class EmptyResponse extends Component {

  render() {
    const avatar = (
      <div className="avatar-bg">
        <img src={watsonAvatar} alt="watson-avatar" className="avatar-image" />
      </div>
    );

    let data = (
      <div className="flex items-start mb-4 text-sm">
        <img src={watsonAvatar} className="w-10 h-10 rounded mr-3" />
        <div className="flex-1 overflow-hidden">
          <div>
            <span className="font-bold">Chatbot</span>
            <span className="text-grey text-xs"> ..:..</span>
          </div>
          <p className="text-black leading-normal">
            Welcome to the chatbot!
          </p>
        </div>
      </div>
    );
    return <div>{data}</div>;
  }
}

export default EmptyResponse;
