import React from 'react';

export function Reactions() {

  const [reactions, setReactions] = React.useState([
    { friend: 'Friend 1', type: '🔥' },
    { friend: 'Friend 2', type: '🔥' },
    { friend: 'Friend 3', type: '❄️' },
    { friend: 'Friend 4', type: '💪' },
  ]);

  return (
    <main className="container-fluid bg-dark text-light d-flex flex-column align-items-center mt-5 pt-3">
      <div className="content-wrapper w-75">
        <h1>Reactions</h1>
        <div className="reaction-cards d-flex flex-column gap-3 mt-3">
          {reactions.map((reaction, index) => (
            <div key={index} className="card bg-secondary text-light">
              <div className="card-body d-flex justify-content-between align-items-center">
                <h5 className="card-title mb-0">{reaction.friend}</h5>
                <span className="reaction-type fs-2">{reaction.type}</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </main>
  );
}