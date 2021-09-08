import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Login from './pages/Login'
import Signup from './pages/Signup';
import Logout from './pages/Logout';
import Game from './pages/Game';

const App = () => {
  return (
    <div className='App'>
      <Router>
        <Navbar />
        <Switch>
          <Route path='/login' component={Login} exact />
          <Route path='/signup' component={Signup} exact />
          <Route path='/logout' component={Logout} exact />
          <Route path='/game' component={Game} exact />
        </Switch>
      </Router>
    </div>
  );
};

export default App;
