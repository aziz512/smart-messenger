import './App.css';
import DialogueScreen from './components/DialogueScreen/DialogueScreen';
import Login from './components/Login/Login';
import SignUp from './components/SignUp/SignUp';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import HomeScreen from './components/Home/HomeScreen';

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/login">
          <Login />
        </Route>
        <Route path="/signup">
          <SignUp />
        </Route>
        <Route path="/">
          <HomeScreen />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
