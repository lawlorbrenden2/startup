import React from 'react';

export function Workouts() {
  const [workouts, setWorkouts] = React.useState([]);
  const [selectedDay, setSelectedDay] = React.useState(null);
  const [newExercise, setNewExercise] = React.useState('');

  // Fetch workouts from backend on load
  React.useEffect(() => {
    fetch('/api/workouts', { credentials: 'include' })
      .then(res => res.ok ? res.json() : [])
      .then(data => setWorkouts(data));
  }, []);

  const selectDay = (day) => setSelectedDay(day);

  const addExercise = (exercise) => {
    if (!exercise || !selectedDay) return;

    const currentWorkout = workouts.find(w => w.day === selectedDay);
    if (currentWorkout && currentWorkout.exercises.some(e => e.name.toLowerCase() === exercise.toLowerCase())) {
      alert(`${exercise} is already in the list for ${selectedDay}.`);
      return;
    }

    const today = new Date().toISOString().split('T')[0];

    const workoutPayload = {
      day: selectedDay,
      date: today,
      exercises: [{ name: exercise, results: [] }],
      notes: ''
    };

    fetch('/api/workouts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(workoutPayload)
    })
      .then(res => res.json())
      .then(savedWorkout => {
        setWorkouts(prev => [
          ...prev.filter(w => w.day !== selectedDay),
          savedWorkout
        ]);
        setNewExercise('');
      });
  };

  const removeExercise = (exerciseName) => {
    if (!selectedDay) return;

    fetch(`/api/workouts/${selectedDay}/exercises/${exerciseName}`, {
      method: 'DELETE',
      credentials: 'include'
    }).then(() => {
      setWorkouts(prev =>
        prev.map(w =>
          w.day === selectedDay
            ? { ...w, exercises: w.exercises.filter(e => e.name !== exerciseName) }
            : w
        )
      );
    });
  };

  const reportExercise = (exerciseName) => {
    if (!selectedDay) return;
    const resultValue = prompt(`Enter result (e.g., weight, reps) for ${exerciseName} on ${selectedDay}:`);
    if (!resultValue) return;

    const parsedValue = parseFloat(resultValue);
    if (isNaN(parsedValue)) {
      alert("Invalid input. Please enter a numerical value.");
      return;
    }

    const today = new Date().toISOString().split('T')[0];

    const resultPayload = { value: parsedValue, date: today };

    fetch(`/api/workouts/${selectedDay}/exercises/${exerciseName}/results`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(resultPayload)
    })
      .then(res => res.json())
      .then(updatedWorkout => {
        setWorkouts(prev =>
          prev.map(w =>
            w.day === selectedDay ? updatedWorkout : w
          )
        );
      });
  };

  const updateWorkoutType = (day, newType) => {
    fetch(`/api/workouts/${day}/type`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ type: newType })
    })
      .then(res => res.json())
      .then(updatedWorkout => {
        setWorkouts(prev =>
          prev.map(w => w.day === day ? updatedWorkout : w)
        );
      });
  };

  const selectedWorkout = workouts.find(w => w.day === selectedDay);

  return (
    <main className="container-fluid bg-dark text-light d-flex flex-column align-items-center mt-5 pt-3">
      <div className="content-wrapper w-75">
        <h2>My Workout Plan</h2>

        {/* Day selector table */}
        <table className="table table-dark table-hover mt-3">
          <thead>
            <tr>
              <th>Day</th>
              <th>Workout Type</th>
            </tr>
          </thead>
          <tbody>
            {workouts.map((w) => (
              <tr
                key={w.day}
                className={w.day === selectedDay ? 'table-active' : ''}
                onClick={() => selectDay(w.day)}
                style={{ cursor: 'pointer' }}
              >
                <td>{w.day}</td>
                <td>{w.type}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {selectedWorkout ? (
          <div className="mt-4">
            <h3>{selectedDay} Exercises</h3>

            {/* Workout type dropdown */}
            <div className="mb-3 text-center">
              <label className="d-block mb-2">Workout Type:</label>
              <div className="dropdown d-inline-block">
                <button
                  className="btn btn-primary dropdown-toggle"
                  type="button"
                  data-bs-toggle="dropdown"
                >
                  {selectedWorkout.type}
                </button>
                <ul className="dropdown-menu dropdown-menu-center">
                  {['Push', 'Pull', 'Legs', 'Upper Body', 'Lower Body', 'Abs', 'Rest'].map((type) => (
                    <li key={type}>
                      <button
                        className="dropdown-item text-center"
                        onClick={() => updateWorkoutType(selectedDay, type)}
                      >
                        {type}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Exercises list */}
            <ul className="list-unstyled">
              {selectedWorkout.exercises.map((ex, idx) => (
                <li key={idx} className="d-flex justify-content-between align-items-center mb-2 p-2 border-bottom">
                  {ex.name} ({ex.results.length} results)
                  <div>
                    <button className="btn btn-sm btn-danger me-1" onClick={() => removeExercise(ex.name)}>−</button>
                    <button className="btn btn-sm btn-info" onClick={() => reportExercise(ex.name)}>Report</button>
                  </div>
                </li>
              ))}
            </ul>

            {/* Add new exercise */}
            <div className="mt-4 d-flex gap-2 align-items-center justify-content-center">
              <input
                type="text"
                value={newExercise}
                onChange={e => setNewExercise(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        addExercise(newExercise);
                    }
                }}
                placeholder="New exercise"
                className="form-control"
              />
              <button className="btn btn-primary" onClick={() => addExercise(newExercise)}>Add</button>
            </div>
          </div>
        ) : (
          <p>Click a day to view exercises for that day.</p>
        )}
      </div>
    </main>
  );
}
