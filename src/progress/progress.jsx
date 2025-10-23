import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Label } from 'recharts';

export function Progress() {

  const [selectedFriend, setSelectedFriend] = React.useState(null);
  const [selectedExercise, setSelectedExercise] = React.useState(null);
  const [friends, setFriends] = React.useState(['Me', 'Friend 1', 'Friend 2', 'Friend 3']);
  const [exercises, setExercises] = React.useState(['Bench Press', 'Squat', 'Deadlift']);
  const emojiOptions = ['🔥', '💪', '❄️', '❤️', '🎯', '🏋️'];
  const [sentReactions, setSentReactions] = React.useState([]);
  const [newFriend, setNewFriend] = React.useState('');

  const addFriend = (friend) => {
    if (!friend) return;
    setFriends((prevFriends) => [...prevFriends, friend]);
    setNewFriend('');
  }


  const chartData = [
    { date: 'M', weight: Math.floor(Math.random() * 50 + 40) },
    { date: 'Tu', weight: Math.floor(Math.random() * 50 + 41) },
    { date: 'W', weight: Math.floor(Math.random() * 50 + 42) },
    { date: 'Th', weight: Math.floor(Math.random() * 50 + 43) },
    { date: 'F', weight: Math.floor(Math.random() * 50 + 44) },
    { date: 'Sat', weight: Math.floor(Math.random() * 50 + 45) },
    { date: 'Sun', weight: Math.floor(Math.random() * 50 + 46) },
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

      {/* I realized that there needed to be a way to add friends, 
        not sure if this is the best way to do it. I might decide to add a whole new page later */}
        <div className="add-friend mb-3 d-flex justify-content-center"> 
          <input
            type="text"
            className="form-control w-auto"
            placeholder="Add friends"
            value={newFriend}
            onChange={(e) => setNewFriend(e.target.value)}
          />
          <button className="btn btn-primary" onClick={() => addFriend(newFriend)}>
            Add
          </button>
        </div>

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
        <div className="emoji-reactions text-center mb-3">
          <label className="d-block mb-2">Send {selectedFriend} a reaction!</label>
          <div className="dropdown d-inline-block">
            <button
              className="btn btn-primary dropdown-toggle"
              type="button"
              data-bs-toggle="dropdown"
            >
              Select Reaction
            </button>
            <ul className="dropdown-menu">
              {emojiOptions.map((emoji) => (
                <li key={emoji}>
                  <button
                    className="dropdown-item text-center"
                    onClick={() => sendReaction(emoji)}
                  >
                    {emoji}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <h4>
        {selectedFriend && selectedExercise
          ? `${selectedFriend} - ${selectedExercise}`
          : "Select a user and an exercise"}
      </h4>


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
