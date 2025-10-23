import React from 'react';

export function Login({ userName, authState, onAuthChange }) {
  return (
    <main className="container-fluid bg-dark text-light d-flex flex-column align-items-center mt-5 pt-3">
      <div className="content-wrapper">
        <h1>Welcome</h1>
        <form method="get" action="/progress" className="text-center">
          <div className="input-group mb-3">
            <span className="input-group-text">@</span>
            <input className="form-control" type="text" placeholder="your@email.com" />
          </div>
          <div className="input-group mb-3">
            <span className="input-group-text">🔒</span>
            <input className="form-control" type="password" placeholder="password" />
          </div>
          <button type="submit" className="btn btn-primary">Sign in</button>
          <button type="submit" className="btn btn-dark">Create</button>
        </form>
      </div>
    </main>
  );
}