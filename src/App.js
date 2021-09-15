import React from "react";
import { BrowserRouter as Router, Switch, Route, Redirect} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import LoginForm from "./components/auth/LoginForm";
import Home from "./components/Home/Home";
import AuthContextProvider from "./store/auth-context";
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <AuthContextProvider>
      <ToastContainer/>
      <Router>
        <Switch>
          <Route path="/Login" component={LoginForm} />
          <Route path="/Register" component={LoginForm} />
          <Route path="/Home" component={Home} />
          {/* <Route path="/not-found" component={NotFound} /> */}
          <Redirect from="/" exact to="/Login" />
          <Redirect to="/not-found" />
        </Switch>
      </Router>
    </AuthContextProvider>
  );
}

export default App;
