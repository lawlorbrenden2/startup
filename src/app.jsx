import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './app.css';

import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom';
import { Login } from './login/login';
import { Progress } from './progress/progress';
import { Reactions } from './reactions/reactions';
import { Workouts } from './workouts/workouts';


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
              <ul className="dropdown-menu" data-bs-theme="dark">
                <li><NavLink className="dropdown-item" to="/">Home</NavLink></li>
                <li><NavLink className="dropdown-item" to="/progress">Progress</NavLink></li>
                <li><NavLink className="dropdown-item" to="/workouts">Workouts</NavLink></li>
                <li><NavLink className="dropdown-item" to="/reactions">Reactions</NavLink></li>
              </ul>
            </div>
            <div className="navbar-brand mx-auto">
              FlexBook<sup>&reg;</sup>
            </div>
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
