import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export function Progress() {

  const [selectedFriend, setSelectedFriend] = React.useState(null);
  const [selectedExercise, setSelectedExercise] = React.useState(null);
  const [friends, setFriends] = React.useState(['Me', 'Friend 1', 'Friend 2', 'Friend 3']);
  const [exercises, setExercises] = React.useState(['Bench Press', 'Squat', 'Deadlift']);
  const [graphUrl, setGraphUrl] = React.useState('graph_up.jpg');
  const emojiOptions = ['🔥', '💪', '❄️', '❤️', '🎯', '🏋️'];

  // Sample data (replace with real exercise progress later)
  const chartData = [
    { date: 'Day 1', weight: 50 },
    { date: 'Day 2', weight: 55 },
    { date: 'Day 3', weight: 60 },
    { date: 'Day 4', weight: 65 },
    { date: 'Day 5', weight: 70 },
  ];

  const sendReaction = (emoji) => {
    if (!selectedFriend || !selectedExercise) return;

    const newReaction = {
      friend: selectedFriend,
      exercise: selectedExercise,
      emoji: emoji,
      time: new Date(),
    };

    setSentReactions((prevReactions) => [...prevReactions, newReaction]);
    console.log(`Sent reaction: ${emoji} to ${selectedFriend} for ${selectedExercise}`);
  }


  return (
    <main className="container-fluid bg-dark text-light d-flex flex-column align-items-center mt-5 pt-3">
      <div className="content-wrapper">
        <h1>Progress</h1>
        {selectedFriend && <h4>Current user: {selectedFriend}</h4>}


        <div className="dropdown-row d-flex justify-content-center my-3">
          <div className="dropdown me-3">
            <button className="btn btn-primary dropdown-toggle" type="button" data-bs-toggle="dropdown">
              Friends
            </button>
            <ul className="dropdown-menu">
              {friends.map((friend, index) => ( 
                <li key={index}>
                  <button className="dropdown-item" onClick={() => setSelectedFriend(friend)}>
                    {friend}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="dropdown">
            <button className="btn btn-primary dropdown-toggle" type="button" data-bs-toggle="dropdown">
              Exercises
            </button>
            <ul className="dropdown-menu">
              {exercises.map((exercise, index) => ( 
                <li key={index}>
                  <button className="dropdown-item" onClick={() => setSelectedExercise(exercise)}>
                    {exercise}
                  </button>
                </li>
              ))}              
            </ul>
          </div>
        </div>
      </div>
      <h2>{selectedExercise || "Select an exercise"}</h2>
      <div className="graph mb-3">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="weight" stroke="#6d0fb0" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      {selectedFriend && selectedExercise && (
        <div className="reaction-dropdown mt-3 text-center">
          <p>Send your friend a reaction!</p>
          <div className="dropdown">
            <button className="btn btn-primary dropdown-toggle" type="button" data-bs-toggle="dropdown">
              Select Reaction
            </button>
            <ul className="dropdown-menu">
              {emojiOptions.map((emoji, index) => (
                <li key={index}>
                  <button className="dropdown-item" onClick={() => sendReaction(emoji)}>
                    {emoji}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </main>
  );
}
