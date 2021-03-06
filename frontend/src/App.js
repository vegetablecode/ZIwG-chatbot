import "./styles/App.css";
import React, { Component } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store";
import Navbar from "./components/Layout/Navbar";
import Chatbot from "./components/Chatbot";
import Landing from "./components/Layout/Landing";
import Register from "./components/UserManagement/Register";
import Login from "./components/UserManagement/Login";
import Settings from "./components/UserManagement/Settings";
import jwt_decode from "jwt-decode";
import setJWTToken from "./securityUtils/setJWTToken";
import { SET_CURRENT_USER } from "./actions/types";
import { logout } from "./actions/securityActions";
import Dashboard from "./components/UserManagement/Dashboard";
import ApiDocumentEdit from "./components/UserManagement/Documents/ApiDocumentEdit";
import ZapierDocumentEdit from "./components/UserManagement/Documents/ZapierDocumentEdit";

const jwtToken = localStorage.jwtToken;
if (jwtToken) {
  setJWTToken(jwtToken);
  const decoded = jwt_decode(jwtToken);
  store.dispatch({
    type: SET_CURRENT_USER,
    payload: decoded
  });
  const currentTime = Date.now() / 1000;
  if (decoded.exp < currentTime) {
    store.dispatch(logout());
    window.location.href = "/login";
  }
}

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <BrowserRouter>
          <div className="App">

            <Switch>
              {
                // Public Routes
              }
              <Route exact path="/" component={Landing} />
              <Route exact path="/register" component={Register} />
              <Route exact path="/login" component={Login} />
              <Route path="/chatbot" component={Chatbot} />
              <Route path="/settings" component={Settings} />
              <Route path="/dashboard" component={Dashboard} />
              <Route path="/apiedit/:documentId" component={ApiDocumentEdit} />
              <Route path="/zapieredit/:documentId" component={ZapierDocumentEdit} />
              {
                // Private Routes
              }
            </Switch>
          </div>
        </BrowserRouter>
      </Provider>
    );
  }
}

export default App;
