import React, { Component } from "react";
import { createNewUser } from "../../actions/securityActions";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import classnames from "classnames";
import LoadingSpinner from "../LoadingSpinner";
import { Link } from "react-router-dom";

class Register extends Component {
  state = {
    username: "",
    fullName: "",
    password: "",
    confirmPassword: "",
    errors: {},
    loading: false
  };

  onSubmit = e => {
    e.preventDefault();
    this.setState({
      loading: true
    })
    const newUser = {
      username: this.state.username,
      fullName: this.state.fullName,
      password: this.state.password,
      confirmPassword: this.state.confirmPassword
    };
    console.log(newUser)
    this.props.createNewUser(newUser, this.props.history);
    this.setState({
      loading: false
    })
  };

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  render() {
    const { errors } = this.props;
    let data;
    if (this.state.loading) {
      data = <LoadingSpinner />;
    } else {
      data = (
        <div className="w-full flex flex-wrap">
          {/* Login Section */}
          <div className="w-full md:w-1/2 flex flex-col">
            <div className="flex flex-col justify-center md:justify-start my-auto pt-8 md:pt-0 px-8 md:px-24 lg:px-32">
              <p className="text-center text-3xl">Register</p>
              <form className="flex flex-col pt-3 md:pt-8" onSubmit={this.onSubmit}>
                <div className="flex flex-col pt-4">
                  <label htmlFor="name" className="text-lg">Full Name</label>
                  <input name="fullName" type="text" placeholder="John Doe" value={this.state.fullName}
                    onChange={this.onChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mt-1 leading-tight focus:outline-none focus:shadow-outline" />
                  <span
                    className="helper-text"
                  >
                    {errors.fullName && (
                      <div className="text-red-800">
                        {errors.fullName}
                      </div>
                    )}
                  </span>
                </div>
                <div className="flex flex-col pt-4">
                  <label htmlFor="email" className="text-lg">Email</label>
                  <input name="username" type="email" id="email" placeholder="your@email.com" value={this.state.username}
                    onChange={this.onChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mt-1 leading-tight focus:outline-none focus:shadow-outline" />
                  <span
                    className="helper-text"
                  >
                    {errors.username && (
                      <div className="text-red-800">
                        {errors.username}
                      </div>
                    )}
                  </span>
                </div>
                <div className="flex flex-col pt-4">
                  <label htmlFor="password" className="text-lg">Password</label>
                  <input name="password" type="password" id="password" placeholder="Password" value={this.state.password}
                    onChange={this.onChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mt-1 leading-tight focus:outline-none focus:shadow-outline" />
                  <span
                    className="helper-text"
                  >
                    {errors.password && (
                      <div className="text-red-800">
                        {errors.password}
                      </div>
                    )}
                  </span>
                </div>
                <div className="flex flex-col pt-4">
                  <label htmlFor="password" className="text-lg">Password</label>
                  <input name="confirmPassword" type="password" id="password" placeholder="Password" value={this.state.confirmPassword}
                    onChange={this.onChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mt-1 leading-tight focus:outline-none focus:shadow-outline" />
                  <span
                    className="helper-text"
                  >
                    {errors.confirmPassword && (
                      <div className="text-red-800">
                        {errors.confirmPassword}
                      </div>
                    )}
                  </span>
                </div>
                <input type="submit" defaultValue="Log In" className="mt-6 mb-12 md:mb-0 md:mt-10 inline-block py-3 px-8 text-white bg-indigo-500 hover:bg-indigo-600 rounded-lg shadow" />
              </form>
              <div className="text-center pt-12 pb-12">
                <p>Already have an account? <Link to="/login" className="underline font-semibold">Login here.</Link></p>
              </div>
            </div>
          </div>
          {/* Image Section */}
          <div className="w-1/2 shadow-2xl">
            <img className="object-cover w-full h-screen hidden md:block" src="https://source.unsplash.com/IXUM4cJynP0" />
          </div>
        </div>
      );
    }
    return <div>{data}</div>;
  }
}

Register.propTypes = {
  createNewUser: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { createNewUser }
)(Register);
