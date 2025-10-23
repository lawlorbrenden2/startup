import React from 'react';

export function Reactions() {
  const [reactions, setReactions] = React.useState([
    { friend: 'Friend 1', emoji: '🔥', time: new Date('2025-10-22T14:00:00') },
    { friend: 'Friend 2', emoji: '🔥', time: new Date('2025-10-22T14:05:00') },
    { friend: 'Friend 3', emoji: '❄️', time: new Date('2025-10-22T13:50:00') },
    { friend: 'Friend 4', emoji: '💪', time: new Date('2025-10-20T14:02:00') }, 
    { friend: 'Friend 1', emoji: '💪', time: new Date('2025-10-21T14:02:00') },
    { friend: 'Friend 4', emoji: '🔥', time: new Date('2025-10-18T14:02:00') },
    { friend: 'Friend 8', emoji: '🔥', time: new Date('2025-09-14T14:02:00') },
  ]);

  const [now, setNow] = React.useState(new Date());

  React.useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date()); // triggers re-render to update filtered reactions
    }, 60000); 
    return () => clearInterval(interval);
  }, []);

  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const recentReactions = reactions.filter(reaction => reaction.time >= sevenDaysAgo);

  return (
    <main className="container-fluid bg-dark text-light d-flex flex-column align-items-center mt-5 pt-3">
      <div className="content-wrapper w-75">
        <h1>Reactions</h1>
        <div className="reaction-cards d-flex flex-column gap-3 mt-3">
          {recentReactions.length > 0 ? (
            recentReactions.map((reaction, index) => (
              <div key={index} className="card bg-secondary text-light">
                <div className="card-body d-flex justify-content-between align-items-center">
                  <h5 className="card-title mb-0">{reaction.friend}</h5>
                  <span className="reaction-type fs-2">{reaction.emoji}</span>
                </div>
              </div>
          ))
          ) : (
            <p>No reactions in the last 7 days 😭.</p>
          )}
        </div>
      </div>
    </main>
  );
}
