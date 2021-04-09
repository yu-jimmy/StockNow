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
import QrCode from './components/QrCode/qrcode';
import TwoFactor from './components/TwoFactor/twofactor';
import TwoFactorLogin from './components/TwoFactorLogin/twofactorlogin';

class App extends Component {
  state = {
    email: localStorage.getItem('email'),
    token: localStorage.getItem('token'),
    userId: localStorage.getItem('userId'),
    watchlist: localStorage.getItem('watchlist'),
    twoFactor: localStorage.getItem('twoFactor'),
    twoFactorSecret: localStorage.getItem('twoFactorSecret'),
    twoFactorSecretAscii: localStorage.getItem('twoFactorSecretAscii'),
    successfulLogin: localStorage.getItem('successfulLogin'),
  };

  twoFactorLogin = () => {
    localStorage.setItem('successfulLogin', true);
    this.setState({ successfulLogin: true });
  };

  login = (email, userId, token, tokenExp, symbols, twoFactor, twoFactorSecret, twoFactorSecretAscii) => {
    localStorage.setItem('email', email);
    localStorage.setItem('token', token);
    localStorage.setItem('userId', userId);
    localStorage.setItem('watchlist', symbols);
    localStorage.setItem('twoFactor', twoFactor);
    localStorage.setItem('twoFactorSecret', twoFactorSecret);
    localStorage.setItem('twoFactorSecretAscii', twoFactorSecretAscii);
    this.setState({ email: email, token: token, userId: userId, watchlist: symbols, twoFactor: twoFactor, twoFactorSecret: twoFactorSecret, twoFactorSecretAscii: twoFactorSecretAscii});
    if(!twoFactor){
      this.twoFactorLogin(true);
    }
  };

  logout = () => {
    localStorage.removeItem('email');
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('watchlist');
    localStorage.removeItem('twoFactor');
    localStorage.removeItem('twoFactorSecret');
    localStorage.removeItem('successfulLogin');
    this.setState({ email: null, token: null, userId: null, watchlist: null, twoFactor: null, twoFactorSecret: null, twoFactorSecretAscii: null, successfulLogin: null});
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
              twoFactor: this.state.twoFactor,
              twoFactorSecret: this.state.twoFactorSecret,
              successfulLogin: this.state.successfulLogin,
              twoFactorSecretAscii: this.state.twoFactorSecretAscii,
              twoFactorLogin: this.twoFactorLogin,
              login: this.login,
              logout: this.logout}}>
            <Navigation />
            {this.state.successfulLogin && <Watchlist />}
            <main>
              <Switch>
                {this.state.twoFactor && !this.state.successfulLogin && <Redirect exact from="/signin" to="/signin2fa"/>}
                {this.state.successfulLogin && <Redirect exact from="/signin2fa" to="/home"/>}
                {!this.state.successfulLogin && <Redirect exact from="/" to="/signin"/>}
                {this.state.successfulLogin && <Redirect exact from="/" to="/home"/>}
                {this.state.successfulLogin && <Redirect exact from="/signin" to="/home"/>}
                <Route path="/home" component={Dashboard} />
                <Route path="/signin" component={Landing} />
                <Route path="/signin2fa" component={TwoFactorLogin} />
                <Route path="/signup" component={Signup} />
                <Route path="/qrcode" component={QrCode} />
                <Route path="/2fa" component={TwoFactor} />
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
