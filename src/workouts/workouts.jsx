import React from 'react';

export function Workouts() {
  const [workouts, setWorkouts] = React.useState([]);
  const [selectedDay, setSelectedDay] = React.useState(null);
  const [newExercise, setNewExercise] = React.useState('');

  React.useEffect(() => {
    const stored = localStorage.getItem('workouts');
    if (stored) setWorkouts(JSON.parse(stored));
    else
      setWorkouts([
        { day: 'Monday', type: 'Push', exercises: [] },
        { day: 'Tuesday', type: 'Pull', exercises: [] },
        { day: 'Wednesday', type: 'Legs', exercises: [] },
        { day: 'Thursday', type: 'Push', exercises: [] },
        { day: 'Friday', type: 'Pull', exercises: [] },
        { day: 'Saturday', type: 'Legs', exercises: [] },
        { day: 'Sunday', type: 'Rest', exercises: [] },
      ]);
  }, []);

  React.useEffect(() => {
    localStorage.setItem('workouts', JSON.stringify(workouts));
  }, [workouts]);

  const selectDay = (day) => setSelectedDay(day);

  const addExercise = (exercise) => {
    if (!exercise || !selectedDay) return;
    setWorkouts(prev =>
      prev.map(w =>
        w.day === selectedDay ? { ...w, exercises: [...w.exercises, exercise] } : w
      )
    );
    setNewExercise('');
  };

  const removeExercise = (exercise) => {
    if (!selectedDay) return;
    setWorkouts(prev =>
      prev.map(w =>
        w.day === selectedDay
          ? { ...w, exercises: w.exercises.filter(e => e !== exercise) }
          : w
      )
    );
  };

  const reportExercise = (exercise) => {
    if (!selectedDay) return;
    const result = prompt(`Enter result for ${exercise} on ${selectedDay}:`);
    if (!result) return;
    setWorkouts(prev =>
      prev.map(w =>
        w.day === selectedDay
          ? {
              ...w,
              exercises: w.exercises.map(e =>
                e === exercise ? `${e} - Result: ${result}` : e
              ),
            }
          : w
      )
    );
  };

  const updateWorkoutType = (day, newType) => {
  setWorkouts(prev =>
    prev.map(w => w.day === day ? { ...w, type: newType } : w)
  );
};


  const selectedWorkout = workouts.find(w => w.day === selectedDay);

return (
  <main className="container-fluid bg-dark text-light d-flex flex-column align-items-center mt-5 pt-3">
    <div className="content-wrapper w-75">
      <h2>My Workout Plan</h2>

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


          <ul>
            {selectedWorkout.exercises.map((ex, idx) => (
              <li key={idx} className="d-flex justify-content-between align-items-center">
                {ex}
                <div>
                  <button className="btn btn-sm btn-danger me-1" onClick={() => removeExercise(ex)}>−</button>
                  <button className="btn btn-sm btn-info" onClick={() => reportExercise(ex)}>Report</button>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-2 d-flex gap-2 align-items-cente justify-content-center">
            <input
              type="text"
              value={newExercise}
              onChange={e => setNewExercise(e.target.value)}
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
