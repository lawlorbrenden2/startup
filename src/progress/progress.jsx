import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Label } from 'recharts';

export function Progress() {

  const [selectedFriend, setSelectedFriend] = React.useState('Me'); // Default to 'Me' for better UX
  const [selectedExercise, setSelectedExercise] = React.useState(null);
  const [friends, setFriends] = React.useState(['Me']); // Default friend list with 'Me'  
  // REMOVED: const [exercises, setExercises] = React.useState(['Bench Press', 'Squat', 'Deadlift']); 
  const emojiOptions = ['🔥', '💪', '❄️', '❤️', '🎯', '🏋️'];
  const [sentReactions, setSentReactions] = React.useState([]);
  const [newFriend, setNewFriend] = React.useState('');
  const [workouts, setWorkouts] = React.useState([]); 

  const addFriend = (friend) => {
    if (!friend || friends.includes(friend)) return;
    setFriends((prevFriends) => [...prevFriends, friend]);
    setNewFriend('');
  }

  // Load workouts from localStorage on mount
  React.useEffect(() => {
    const storedData = localStorage.getItem('workouts');
    if (storedData) {
      setWorkouts(JSON.parse(storedData));
    }
  }, []);

  // Listen for changes in localStorage from other tabs/components
  React.useEffect(() => {
    const handleStorageChange = () => {
      const stored = localStorage.getItem('workouts');
      if (stored) setWorkouts(JSON.parse(stored));
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // ✅ New Logic: Dynamically generate the list of unique exercises
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


  // Logic to pull historical data for the chart
  const chartData = React.useMemo(() => {
    if (!selectedExercise || !workouts || workouts.length === 0) return [];

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
    
    // Deduplicate points (keep the latest reported weight for a given date)
    const uniqueData = {};
    dataPoints.forEach(item => {
        uniqueData[item.date] = item.weight; 
    });

    return Object.keys(uniqueData).map(date => ({
        date: date, 
        weight: uniqueData[date]
    }));

  }, [selectedExercise, workouts]);


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

      {/* Friend Add Input: Already dynamic with state updates */}
        <div className="add-friend mb-3 d-flex justify-content-center gap-2"> 
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
          {/* Friends Dropdown: Uses the dynamic 'friends' state */}
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

          {/* Exercises Dropdown: Uses the dynamic 'dynamicExerciseList' */}
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
          ? `${selectedFriend}'s Progress on ${selectedExercise}`
          : "Select a friend and an exercise"}
      </h4>


      <div className="graph mb-3" style={{ width: '100%', height: 300 }}>
        {selectedExercise && chartData.length > 0 ? (
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
              {selectedExercise 
                ? `No progress data found for ${selectedExercise}.`
                : "Select an exercise to view progress."
              }
            </p>
          )}
      </div>
    </main>
  );
}