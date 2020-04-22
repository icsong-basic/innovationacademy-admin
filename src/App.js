import React from "react";
import { Router, Route, Switch } from "react-router-dom";

import { observer } from 'mobx-react';
import routes from "./routes";

import "bootstrap/dist/css/bootstrap.min.css";
import "./shards-dashboard/styles/shards-dashboards.1.1.0.min.css";
import "./assets/styles/App.scss";
import history from "./history";
import LoginStatus from "./data/singleton/LoginStatus";
import constants from "./constants";
import NotFoundPage from "./NotFoundPage";

@observer
class App extends React.Component {
  componentDidMount() {
    LoginStatus.checkLoginStatus();
  }

  render() {
    if (LoginStatus.initialWaiting) {
      return <p className="checking-login-status">Checking login status...</p>;
    }

    return (
      <Router basename={constants.basePath} history={history}>
        <div>
          {
            <Switch>
              {
                routes.filter(route => {
                  if (!route.authorities) {
                    return true;
                  }
                  if (LoginStatus.isAdmin() >= 0) {
                    // Admin이면 모든 페이지 방문가능
                    return true;
                  }
                  let pageBlocked = true;
                  for (let pageAuthority of route.authorities) {
                    if (LoginStatus.authorities.findIndex(userAuth => userAuth.name === pageAuthority) >= 0) {
                      pageBlocked = false;
                      break;
                    }
                  }
                  return !pageBlocked;
                }).map((route, index) => {
                  return (
                    <Route
                      key={index}
                      path={route.path}
                      exact={route.exact}
                      component={(props) => {
                        return <route.layout {...props}>
                          <route.component {...props} />
                        </route.layout>;
                      }}
                    />
                  );
                })
              }
              <Route component={NotFoundPage} />
            </Switch>
          }
        </div>
      </Router>
    );
  }
}

export default App;