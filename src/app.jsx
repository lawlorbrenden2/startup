import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './app.css';

import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom';
import { login } from './login/login';
import { progress } from './progress/progress';
import { ractions } from './reactions/reactions';
import { workouts } from './workouts/workouts';


export default function App() {
  return (
    <BrowserRouter>
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

        <Routes>
          <Route path='/' element={<Login />} exact />
          <Route path='/progress' element={<Progress />} />
          <Route path='/reactions' element={<Reactions />} />
          <Route path='/workouts' element={<Workouts />} />
          <Route path='*' element={<NotFound />} />
        </Routes>

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
    </BrowserRouter>
  );
}

function NotFound() {
  return <main className="container-fluid bg-secondary text-center">404: Return to sender. Address unknown.</main>;
}
