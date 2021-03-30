import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import SignIn from "./components/SignIn";
import Gallary from "./components/Gallary";

const routes = [
  {
    path: "/",
    exact: true,
    main: () => <Gallary />
  },
  {
    path: "/login",
    exact: true,
    main: () => <SignIn />
  }
]

function App(props) {

  return <div>
    <Router basename="/">
      <Switch>
        {routes.map((route, index) => (
          <Route
            key={index}
            path={route.path}
            exact={route.exact}
            children={<route.main history={props.history} />}
          />
        ))}
      </Switch>
    </Router>
  </div>;
}

export default App;