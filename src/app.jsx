import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './app.css';

export default function App() {
  return (
    <div className="app bg-dark text-light">
      <header className="container-fluid">
        <nav className="navbar fixed-top bg-primary navbar-dark">
          <div className="dropdown">
            <button
              className="btn navbar-toggler"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <ul className="dropdown-menu">
              <li><a className="dropdown-item" href="progress.html">Progress</a></li>
              <li><a className="dropdown-item" href="workouts.html">Workouts</a></li>
              <li><a className="dropdown-item" href="reactions.html">Reactions</a></li>
            </ul>
          </div>
          <a className="navbar-brand mx-auto" href="#">
            FlexBook<sup>&reg;</sup>
          </a>
        </nav>
      </header>

      <main className="container-fluid bg-dark text-light d-flex flex-column align-items-center mt-5 pt-3">
        App Components Go Here
      </main>

      <footer className="bg-dark text-white-50">
        <div className="container-fluid d-flex justify-content-between align-items-center">
          <span className="text-reset">Developed by Brenden Lawlor</span>
          <div>
            <a href="https://github.com/lawlorbrenden2/startup" className="me-3 text-reset">
              GitHub
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
