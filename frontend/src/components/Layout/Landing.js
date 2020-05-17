import React, { Component } from "react";
import Footer from "./Footer";
import { Link } from "react-router-dom";

class Landing extends Component {
  render() {
    return (
      <div>
        <div className="section no-pad-bot" id="index-banner">
          <div className="container">
            <br />
            <br />
            <h1 className="header center blue-text text-darken-4">
              ZIwG Chatbot
            </h1>
            <div className="row center">
              <h5 className="header col s12 light">
                A modern chatbot based on IBM Watson.
              </h5>
            </div>
            <div className="container">
              <div className="row">
                <div className="col m6 s12">
                  <Link
                    to="/register"
                    id="download-button"
                    className="waves-effect waves-light btn-large green darken-2 col s12 btn-trial-consultor valign-wrapper"
                  >
                    Sign Up
                  </Link>
                </div>
                <div className="col m6 s12">
                  <Link
                    to="/login"
                    id="download-button"
                    className="waves-effect waves-light btn-large blue darken-4 col s12 btn-trial-consultor valign-wrapper"
                  >
                    Login
                  </Link>
                </div>
              </div>
            </div>
            <br />
            <br />
          </div>
        </div>

        <div className="container">
          <div className="section">
            {
              // Icon section
            }

            <div className="row">
              <div className="col s12 m4">
                <div className="icon-block">
                  <h2 className="center blue-text text-darken-4">
                    <i className="medium material-icons">data_usage</i>
                  </h2>
                  <h5 className="center">Based on IBM Watson</h5>

                  <p className="light">
                    ZIwG Chatbot uses Watson Assistant
                    developed and provided by IBM.
                  </p>
                </div>
              </div>

              <div className="col s12 m4">
                <div className="icon-block">
                  <h2 className="center blue-text text-darken-4">
                    <i className="medium material-icons">devices</i>
                  </h2>
                  <h5 className="center">Available everywhere</h5>

                  <p className="light">
                    ZIwG Chatbot is available on all
                    Internet-connected devices via browser. Now you
                    can use our application wherever you want!
                  </p>
                </div>
              </div>

              <div className="col s12 m4">
                <div className="icon-block">
                  <h2 className="center blue-text text-darken-4">
                    <i className="medium material-icons">chat</i>
                  </h2>
                  <h5 className="center">AI Based</h5>

                  <p className="light">
                    ZIwG Chatbot uses advanced AI
                    algorithms and neural networks to processing
                    and understanding natural language.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <br />
          <br />
        </div>

        <div className="max-w-md mx-auto flex p-6 bg-gray-100 mt-10 rounded-lg shadow-xl">
          <div className="ml-6 pt-1">
            <h1 className="text-2xl text-blue-700 leading-tight">
              Tailwind and Create React App
      </h1>
            <p className="text-base text-gray-700 leading-normal">
              Building apps together
      </p>
          </div>
        </div>

        <Footer />
      </div>
    );
  }
}

export default Landing;
