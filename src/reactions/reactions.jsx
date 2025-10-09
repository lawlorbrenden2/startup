import React from 'react';

export function Reactions() {
  return (
    <main className="container-fluid bg-dark text-light d-flex flex-column align-items-center mt-5 pt-3">
      <div className="content-wrapper w-75">
        <h1>Reactions</h1>

        <div className="reaction-cards d-flex flex-column gap-3 mt-3">
          <div className="card bg-secondary text-light">
            <div className="card-body d-flex justify-content-between align-items-center">
              <span>Friend 1</span>
              <span>🔥</span>
            </div>
          </div>

          <div className="card bg-secondary text-light">
            <div className="card-body d-flex justify-content-between align-items-center">
              <span>Friend 2</span>
              <span>🔥</span>
            </div>
          </div>

          <div className="card bg-secondary text-light">
            <div className="card-body d-flex justify-content-between align-items-center">
              <span>Friend 3</span>
              <span>❄️</span>
            </div>
          </div>

          <div className="card bg-secondary text-light">
            <div className="card-body d-flex justify-content-between align-items-center">
              <span>Friend 4</span>
              <span>💪</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}