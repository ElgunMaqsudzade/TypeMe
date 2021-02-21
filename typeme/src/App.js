import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Navbar from "./components/navbar";
import LSidebar from "./components/l_sidebar";
import RSidebar from "./components/r_sidebar";
import News from "./pages/news";
import Profile from "./pages/profile";
import Error from "./pages/error";

function App() {
  return (
    <>
      <div className="page">
        <Router>
          <Switch>
            <Route exact path="/">
              <div className="page_header">
                <Navbar />
              </div>
              <div className="container page_layout">
                <div className="row">
                  <LSidebar />
                  <div className="col-9 offset-3">
                    <div className="row">
                      <div className="col-8">
                        <News />
                      </div>
                      <div className="col-4">
                        <RSidebar />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Route>
            <Route exact path="/profile">
              <div className="page_header">
                <Navbar />
              </div>
              <div className="container page_layout">
                <div className="row">
                  <LSidebar />
                  <div className="col-9 offset-3">
                    <div className="row">
                      <div className="col-4">
                        <RSidebar />
                      </div>
                      <div className="col-8">
                        <Profile />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Route>
            <Route path="*">
              <Error />
            </Route>
          </Switch>
        </Router>
      </div>
    </>
  );
}

export default App;
