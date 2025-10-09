import React from 'react';

export function Progress() {
  return (
    <main className="container-fluid bg-dark text-light d-flex flex-column align-items-center mt-5 pt-3">
      <div className="content-wrapper">
        <h1>Progress</h1>

        <div className="dropdown-row d-flex justify-content-center my-3">
          <div className="dropdown me-3">
            <button className="btn btn-primary dropdown-toggle" type="button" data-bs-toggle="dropdown">
              Friends
            </button>
            <ul className="dropdown-menu">
              <li><a className="dropdown-item" href="#">Friend 1</a></li>
              <li><a className="dropdown-item" href="#">Friend 2</a></li>
              <li><a className="dropdown-item" href="#">Friend 3</a></li>
              <li><a className="dropdown-item" href="#">Friend 4</a></li>
            </ul>
          </div>

          <div className="dropdown">
            <button className="btn btn-primary dropdown-toggle" type="button" data-bs-toggle="dropdown">
              Exercises
            </button>
            <ul className="dropdown-menu">
              <li><a className="dropdown-item" href="#">Bench Press</a></li>
              <li><a className="dropdown-item" href="#">Squat</a></li>
            </ul>
          </div>
        </div>
      </div>
      <h2>Bench Press</h2>
      <div className="graph my-3">
        <img src="graph_up.jpg" className="img-fluid rounded" alt="Bench Press Progress Graph" />
      </div>
    </main>
  );
}
