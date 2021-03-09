import React from "react";
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import Navbar from "./components/navbar";
import LSidebar from "./components/l_sidebar";
import RSidebar from "./components/r_sidebar";
import News from "./pages/news";
import Profile from "./pages/profile";
import Error from "./pages/error";
import LoginRegister from "./pages/login_register";
import Messenger from "./pages/messenger";
import Friends from "./pages/friends";
import ScrollToTop from "./components/scrolltotop";
import FriendsSidebar from "./components/friends-page-comp/friendsSidebar";
import Photos from "./pages/photos";

function App() {
  const store = JSON.parse(localStorage.getItem("login"));
  return (
    <>
      <div className="page">
        <Router>
          {/* {!store || !store.logined ? <Redirect to="/" /> : null} */}
          <ScrollToTop>
            <Switch>
              <Route exact path="/feed">
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
              <Route exact path="/user/:username">
                <div className="page_header">
                  <Navbar />
                </div>
                <div className="container page_layout">
                  <div className="row">
                    <LSidebar />
                    <div className="col-9 offset-3">
                      <div className="row">
                        <Profile />
                      </div>
                    </div>
                  </div>
                </div>
              </Route>
              <Route exact path="/messenger">
                <div className="page_header">
                  <Navbar />
                </div>
                <div className="container page_layout">
                  <div className="row">
                    <LSidebar />
                    <div className="col-9 offset-3">
                      <Messenger />
                    </div>
                  </div>
                </div>
              </Route>
              <Route exact path="/friends/:section">
                <div className="page_header">
                  <Navbar />
                </div>
                <div className="container page_layout">
                  <div className="row">
                    <LSidebar />
                    <div className="col-9 offset-3">
                      <div className="row">
                        <div className="col-8">
                          <Friends />
                        </div>
                        <div className="col-4">
                          <FriendsSidebar />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Route>
              <Route exact path="/photos/:username">
                <div className="page_header">
                  <Navbar />
                </div>
                <div className="container page_layout">
                  <div className="row">
                    <LSidebar />
                    <div className="col-9 offset-3">
                      <Photos />
                    </div>
                  </div>
                </div>
              </Route>
              <Route exact path="/">
                <div className="container">
                  <div className="row">
                    <LoginRegister />
                  </div>
                </div>
              </Route>
              <Route path="*">
                <Error />
              </Route>
            </Switch>
          </ScrollToTop>
        </Router>
      </div>
    </>
  );
}

export default App;
