import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Label } from 'recharts';

export function Progress() {

  const [selectedFriend, setSelectedFriend] = React.useState('Me'); 
  const [selectedExercise, setSelectedExercise] = React.useState(null);
  const [friends, setFriends] = React.useState(['Me']); // Now includes 'Me' + fetched friends
  const emojiOptions = ['🔥', '💪', '❄️', '❤️', '🎯', '🏋️'];
  
  const [sentReactions, setSentReactions] = React.useState([]); 
  const [receivedReactions, setReceivedReactions] = React.useState([]); // NEW: State for reactions received from others
  
  const [newFriend, setNewFriend] = React.useState('');
  const [workouts, setWorkouts] = React.useState([]); 

  // Load workouts, friends, and received reactions from the backend
  React.useEffect(() => {
    // 1. Fetch Workouts
    fetch('/api/workouts', { credentials: 'include' })
      .then(res => res.ok ? res.json() : [])
      .then(data => setWorkouts(data));
      
    // 2. Fetch Friends
    fetch('/api/friends', { credentials: 'include' })
      .then(res => res.ok ? res.json() : [])
      .then(data => setFriends(['Me', ...data]));

    // 3. Fetch Received Reactions
    fetch('/api/reactions', { credentials: 'include' })
      .then(res => res.ok ? res.json() : [])
      .then(data => setReceivedReactions(data));
  }, []);

  // Add friend by calling the backend API
  const addFriend = (friendEmail) => {
    if (!friendEmail || friends.includes(friendEmail)) return;
    
    fetch('/api/friends', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ friendEmail: friendEmail })
    })
      .then(async (response) => {
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.msg || response.statusText || 'Failed to add friend.');
        }
        return response.json();
      })
      .then(() => {
        setFriends((prevFriends) => [...prevFriends, friendEmail]);
        setNewFriend('');
      });
  }
  const sendReaction = (emoji) => {
    // Cannot send a reaction to yourself
    if (selectedFriend === 'Me' || !selectedExercise) return; 

    const reactionPayload = {
      friendEmail: selectedFriend,
      exerciseName: selectedExercise,
      emoji: emoji,
    };

    fetch('/api/reactions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(reactionPayload)
    })
      .then(async (response) => {
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.msg || response.statusText || 'Failed to send reaction.');
        }
        return response.json();
      })
      .then((newReaction) => {
        setSentReactions((prevReactions) => [...prevReactions, newReaction]);
      });
  }


  const dynamicExerciseList = React.useMemo(() => {
      if (!workouts || workouts.length === 0) return [];

      const uniqueExercises = new Set();
      
      workouts.forEach((dayWorkout) => {
          dayWorkout.exercises.forEach((exercise) => {
              uniqueExercises.add(exercise.name);
          });
      });

      return Array.from(uniqueExercises).sort();
  }, [workouts]);


  const chartData = React.useMemo(() => {
    if (selectedFriend !== 'Me' || !selectedExercise || !workouts || workouts.length === 0) return [];

    const dataPoints = [];

    workouts.forEach((dayWorkout) => {
      const matchingExercise = dayWorkout.exercises.find(
        (e) => e.name === selectedExercise
      );

      if (matchingExercise) {
        matchingExercise.results.forEach((result) => {
          dataPoints.push({ 
            date: result.date,
            weight: result.value
          });
        });
      }
    });

    dataPoints.sort((a, b) => new Date(a.date) - new Date(b.date));
    
    const uniqueData = {};
    dataPoints.forEach(item => {
        uniqueData[item.date] = item.weight; 
    });

    return Object.keys(uniqueData).map(date => ({
        date: date, 
        weight: uniqueData[date]
    }));

  }, [selectedExercise, workouts, selectedFriend]);


  return (
    <main className="container-fluid bg-dark text-light d-flex flex-column align-items-center mt-5 pt-3">
      <div className="content-wrapper">
        <h1>Progress</h1>

        {/* Friend Add Input */}
        <div className="add-friend mb-3 d-flex justify-content-center gap-2"> 
          <input
            type="text"
            className="form-control w-auto"
            placeholder="Enter friend's email"
            value={newFriend}
            onChange={(e) => setNewFriend(e.target.value)}
          />
          <button className="btn btn-primary" onClick={() => addFriend(newFriend)}>
            Add Friend
          </button>
        </div>

        <div className="dropdown-row d-flex justify-content-center my-3">
          <div className="dropdown me-3">
            <button className="btn btn-primary dropdown-toggle" type="button" data-bs-toggle="dropdown">
              {selectedFriend || 'Friend'}
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
              {selectedExercise || 'Exercise'}
            </button>
            <ul className="dropdown-menu">
              {dynamicExerciseList.map((exercise) => ( 
                <li key={exercise}>
                  <button className="dropdown-item" onClick={() => setSelectedExercise(exercise)}>
                    {exercise}
                  </button>
                </li>
              ))}              
            </ul>
          </div>
        </div>
      </div>

      {selectedFriend !== 'Me' && selectedExercise && (
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

      {/* Placeholder for Received Reactions */}
      {receivedReactions.length > 0 && (
        <div className="alert alert-info text-center w-75 mb-4">
          You have **{receivedReactions.length}** new reactions! Example: {receivedReactions[0].emoji} from {receivedReactions[0].senderEmail}.
        </div>
      )}

      <h4>
        {selectedFriend && selectedExercise
          ? `${selectedFriend}'s Progress on ${selectedExercise} (Only showing 'Me' data)`
          : "Select a friend and an exercise"}
      </h4>


      <div className="graph mb-3" style={{ width: '100%', height: 300 }}>
        {selectedFriend === 'Me' && selectedExercise && chartData.length > 0 ? (
          <div style={{ width: '100%', height: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date">
                  <Label value="Date" offset={-5} position="insideBottom" />
                </XAxis>
                <YAxis>
                  <Label value="Result Value" angle={-90} position="insideLeft" style={{ textAnchor: 'middle' }}/>
                </YAxis>
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="weight" stroke="#6d0fb0" strokeWidth={2} name="Result" />
              </LineChart>
            </ResponsiveContainer>
          </div>
          ) : (
            <p>
              {selectedFriend === 'Me' && selectedExercise 
                ? `No progress data found for ${selectedExercise}.`
                : "Select an exercise to view progress. (Cannot view friend data yet)"
              }
            </p>
          )}
      </div>
    </main>
  );
}