import './App.css';
import {BrowserRouter, Redirect, Route, Switch} from 'react-router-dom';

import Landing from './components/Landing/landing';
import Login from './components/Login/login';
import Signup from './components/Signup/signup';

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={Landing} />
        <Route path="/login" component={Login} />
        <Route path="/signup" component={Signup} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
