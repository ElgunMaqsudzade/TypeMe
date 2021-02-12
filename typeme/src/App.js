import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Navbar from "./components/navbar";
import LSidebar from "./components/l_sidebar";
import RSidebar from "./components/r_sidebar";
import Home from "./pages/home";
import Profile from "./pages/home";
import Error from "./pages/error";

function App() {
  return (
    <>
      <div className="page">
        <Router>
          <div className="page_header">
            <Navbar />
          </div>
          <div className="container page_layout">
            <div className="row">
              <LSidebar />
              <div className="col-9 offset-3">
                <div className="row">
                  <Switch>
                    <Route exact path="/">
                      <div className="col-8">
                        <Home />
                      </div>
                      <div className="col-4">
                        <RSidebar />
                      </div>
                    </Route>
                    <Route exact path="/profile">
                      <div className="col-4">
                        <RSidebar />
                      </div>
                      <div className="col-8">
                        <Profile />
                      </div>
                    </Route>
                    <Route path="*">
                      <Error />
                    </Route>
                  </Switch>
                </div>
              </div>
            </div>
          </div>
        </Router>
      </div>
    </>
  );
}

export default App;
