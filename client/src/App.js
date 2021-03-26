import './App.css';
import {BrowserRouter, Route, Switch, Redirect, withRouter} from 'react-router-dom';
import Landing from './components/Landing/landing';
import Signup from './components/Signup/signup';
import Navigation from './components/Navigation/navigation';
import React, { Component }  from 'react';
import AuthContext from './context/auth-context';
import Dashboard from './components/Dashboard/dashboard';
import StockDetails from './components/StockDetails/stockdetails';
import Watchlist from './components/Watchlist/watchlist';

class App extends Component {
  state = {
    email: localStorage.getItem('email'),
    token: localStorage.getItem('token'),
    userId: localStorage.getItem('userId'),
    watchlist: localStorage.getItem('watchlist')
    
  };

  login = (email, userId, token, tokenExp, symbols) => {
    localStorage.setItem('email', email);
    localStorage.setItem('token', token);
    localStorage.setItem('userId', userId);
    localStorage.setItem('watchlist', symbols);
    this.setState({ email: email, token: token, userId: userId, watchlist: symbols});
  };

  logout = () => {
    localStorage.removeItem('email');
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('watchlist');
    this.setState({ email: null, token: null, userId: null, watchlist: null});
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
              watchlist: this.state.watchlist,
              login: this.login,
              logout: this.logout}}>
            <Navigation />
            {this.state.token && <Watchlist />}
            <main>
              <Switch>
                {!this.state.token && <Redirect exact from="/" to="/signin"/>}
                {this.state.token && <Redirect exact from="/" to="/home"/>}
                {this.state.token && <Redirect exact from="/signin" to="/home"/>}
                <Route path="/home" component={Dashboard} />
                <Route path="/signin" component={Landing} />
                <Route path="/signup" component={Signup} />
                <Route path="/stock/:symbol" component={withRouter(StockDetails)} />
              </Switch>
            </main>
          </AuthContext.Provider>
        </React.Fragment>
      </BrowserRouter>
    )
  };
}

export default App;
