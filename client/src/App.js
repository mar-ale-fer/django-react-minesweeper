import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Login from './pages/Login'
import Signup from './pages/Signup';
import Logout from './pages/Logout';
import Game from './pages/Game';
import Board from './pages/Board'

const App = () => {
  return (
    <div className='App'>
      <Router>
        <Navbar />
        <Switch>
          <Route path='/login' exact>
             <Login />
          </Route>

          <Route path='/signup' exact>
             <Signup />
          </Route>
          <Route path='/logout' exact>
             <Logout />
          </Route>
          <Route path='/game' exact>
            <Game />
          </Route>
          <Route path='/board/:id'>
            <Board />
          </Route>
        </Switch>
      </Router>
    </div>
  );
};

export default App;
