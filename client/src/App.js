import './App.css';
import {BrowserRouter, Route, Switch} from 'react-router-dom';

import Landing from './components/Landing/landing';
import Signup from './components/Signup/signup';

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={Landing} />
        <Route path="/signup" component={Signup} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
