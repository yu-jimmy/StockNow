import './App.css';
import {BrowserRouter, Route, Switch, Redirect} from 'react-router-dom';
import Landing from './components/Landing/landing';
import Signup from './components/Signup/signup';
import Navigation from './components/Navigation/navigation';
import React, { Component }  from 'react';
import AuthContext from './context/auth-context';
import Dashboard from './components/Dashboard/dashboard';
class App extends Component {
  state = {
    email: localStorage.getItem('email'),
    token: localStorage.getItem('token'),
    userId: localStorage.getItem('userId')
  };

  login = (email, userId, token, tokenExp) => {
    localStorage.setItem('email', email);
    localStorage.setItem('token', token);
    localStorage.setItem('userId', userId);
    this.setState({ email: email, token: token, userId: userId});
  };

  logout = () => {
    localStorage.removeItem('email');
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    this.setState({ email: null, token: null, userId: null});
  };

  render() {
    return (
      <BrowserRouter>
        <React.Fragment>
          <AuthContext.Provider
            value={{
              email: this.state.email,
              userId: this.state.userId,
              token: this.state.token,
              login: this.login,
              logout: this.logout}}>
            <Navigation />
            <main>
              <Switch>
                {!this.state.token && <Redirect exact from="/" to="/signin"/>}
                {this.state.token && <Redirect exact from="/" to="/home"/>}
                {this.state.token && <Redirect exact from="/signin" to="/home"/>}
                <Route path="/home" component={Dashboard} />
                <Route path="/signin" component={Landing} />
                <Route path="/signup" component={Signup} />
              </Switch>
            </main>
          </AuthContext.Provider>
        </React.Fragment>
      </BrowserRouter>
    )
  };
}

export default App;
