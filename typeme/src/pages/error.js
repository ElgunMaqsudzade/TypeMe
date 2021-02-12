import React from "react";

const Error = () => {
  return (
    <section className="section error-section">
      <div className="container-fluid">
        <div className="col-md-6 offset-3">
          <div className="card">
            <div className="error-page">
              <h1>404</h1>
              <h2>UH OH! You're lost.</h2>
              <p>
                The page you are looking for does not exist. How you got here is a mystery. But you
                can click the button below to go back to the homepage.
              </p>
              <button className="btn green">HOME</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Error;
