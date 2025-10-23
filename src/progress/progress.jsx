import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Label } from 'recharts';

export function Progress() {

  const [selectedFriend, setSelectedFriend] = React.useState(null);
  const [selectedExercise, setSelectedExercise] = React.useState(null);
  const [friends, setFriends] = React.useState(['Me', 'Friend 1', 'Friend 2', 'Friend 3']);
  const [exercises, setExercises] = React.useState(['Bench Press', 'Squat', 'Deadlift']);
  const emojiOptions = ['🔥', '💪', '❄️', '❤️', '🎯', '🏋️'];
  const [sentReactions, setSentReactions] = React.useState([]);


  const chartData = [
    { date: 'M', weight: Math.floor(Math.random() * 50 + 50) },
    { date: 'Tu', weight: Math.floor(Math.random() * 50 + 50) },
    { date: 'W', weight: Math.floor(Math.random() * 50 + 50) },
    { date: 'Th', weight: Math.floor(Math.random() * 50 + 50) },
    { date: 'F', weight: Math.floor(Math.random() * 50 + 50) },
    { date: 'Sat', weight: Math.floor(Math.random() * 50 + 50) },
    { date: 'Sun', weight: Math.floor(Math.random() * 50 + 50) },
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

      {selectedFriend && selectedExercise && (
        <div className="emoji-reactions d-flex justify-content-center gap-2 mb-3">
          <h5 className="me-3">Send {selectedFriend} a reaction:</h5>
          {emojiOptions.map((emoji) => (
            <button
              key={emoji}
              className="btn btn-secondary btn-lg"
              onClick={() => sendReaction(emoji)}
            >
              {emoji}
            </button>
          ))}
        </div>
      )}

      <h4>{selectedExercise || "Select a user and an exercise"}</h4>
      {selectedFriend && selectedExercise && (
        <h4>{selectedFriend} - {selectedExercise}</h4>
      )}


      {/* This graph needs a lot more work, such as functionality to change the date range and such, will add when getting real dynamic data */}
      <div className="graph mb-3" style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date">
              <Label value="Day" offset={-5} position="insideBottom" />
            </XAxis>
            <YAxis>
              <Label value="Weight (lbs)" angle={-90} position="insideLeft" />
            </YAxis>
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="weight" stroke="#6d0fb0" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

    </main>
  );
}
