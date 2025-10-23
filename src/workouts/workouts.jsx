import React from 'react';

export function Workouts() {

  const [workouts, setWorkouts] = React.useState([]);
  const [day, setCurrentDay] = React.useState(null);
  const [newExercise, setNewExercise] = React.useState('');

  React.useEffect(() => {
    const storedWorkouts = localStorage.getItem('workouts');
    if (storedWorkouts) {
      setWorkouts(JSON.parse(storedWorkouts));
    } else {
      // Default workouts if none in localStorage
      setWorkouts([
        { day: 'Monday', type: 'Push', exercises: [] },
        { day: 'Tuesday', type: 'Pull', exercises: [] },
        { day: 'Wednesday', type: 'Legs', exercises: [] },
        { day: 'Thursday', type: 'Push', exercises: [] },
        { day: 'Friday', type: 'Pull', exercises: [] },
        { day: 'Saturday', type: 'Legs', exercises: [] },
        { day: 'Sunday', type: 'Rest', exercises: [] },
      ]);
    }
  }, []);

  React.useEffect(() => {
    localStorage.setItem('workouts', JSON.stringify(workouts));
  }, [workouts]);

  const [selectedDay, setSelectedDay] = React.useState(null);

  const currentDay = new Date().toLocaleDateString('en-US', { weekday: 'long' });

  const selectDay = (day) => {
    setSelectedDay(day);
  };

  const addExercise = (exercise) => {
    if (!selectedExercise) return;
    setWorkouts(prev =>
      prev.map(w =>
        w.day === selectedDay
          ? { ...w, exercises: [...w.exercises, exercise] }
          : w
      )
    );
    setNewExercise('');
  };

  const removeExercise = (exercise) => {
    setWorkouts(prev =>
      prev.map(w =>
        w.day === selectedDay
          ? { ...w, exercises: w.exercises.filter(e => e !== exercise) }
          : w
      )
    );
  };

  const reportExercise = (exercise) => {
    const result = prompt(`Enter result for ${exercise} on ${currentDay}:`);
    if (!result) return;
    setWorkouts(prev =>
      prev.map(w =>
        w.day === currentDay
          ? {
              ...w, exercises: w.exercises.map(e =>
                e === exercise ? `${e} - Result: ${result}` : e
              )
            }
          : w
      )
    );
  }   

  const selectedWorkout = workouts.find(w => w.day === selectedDay);


  return (
    <main className="container-fluid bg-dark text-light d-flex flex-column align-items-center mt-5 pt-3">
      <div className="content-wrapper w-75">
        <h2>My Workout Plan</h2>

        <table className="table table-hover mt-3">
          <tbody>
            {workouts.map((workout) => (
              <tr
                key={workout.day}
                className={workout.day === currentDay ? 'table-active' : ''}
                onClick={() => selectDay(workout.day)}
                style={{ cursor: 'pointer' }}
              >
                <td>{workout.day}</td>
                <td>{workout.type}</td>   
              </tr>
            ))}
          </tbody>
        </table>

        <div className="exercise-details mt-3 text-light">
          {currentDay ? (
            <>
              <h4>Exercises for {currentDay}</h4>
              <ul>
                {workouts.find(w => w.day === currentDay).exercises.map((ex, index) => (
                  <li key={index}>{ex}</li>
                ))}
              </ul>
            </>
          ) : (
            <p>Click a day to view exercises for that day</p>
          )}
        </div>
      </div>
    </main>
  );
}