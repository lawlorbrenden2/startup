import React from 'react';

export function Workouts() {
  const [workouts, setWorkouts] = React.useState([]);
  const [selectedDay, setSelectedDay] = React.useState(null);
  const [newExercise, setNewExercise] = React.useState('');

  const DEFAULT_WORKOUTS = [
    { day: 'Monday', type: 'Push', exercises: [] },
    { day: 'Tuesday', type: 'Pull', exercises: [] },
    { day: 'Wednesday', type: 'Legs', exercises: [] },
    { day: 'Thursday', type: 'Push', exercises: [] },
    { day: 'Friday', type: 'Pull', exercises: [] },
    { day: 'Saturday', type: 'Legs', exercises: [] },
    { day: 'Sunday', type: 'Rest', exercises: [] },
  ];

  const findWorkout = (day) => workouts.find(w => w.day === day);
  const selectDay = (day) => setSelectedDay(day);


  React.useEffect(() => {
    fetch('/api/workouts', { credentials: 'include' })
      .then(res => res.ok ? res.json() : [])
      .then(savedWorkouts => {
        const savedMap = savedWorkouts.reduce((acc, w) => {
          acc[w.day] = w;
          return acc;
        }, {});

        const mergedWorkouts = DEFAULT_WORKOUTS.map(defaultW => {
          return savedMap[defaultW.day] || defaultW;
        });

        setWorkouts(mergedWorkouts);
      });
  }, []);

  const saveDefaultWorkout = (day, currentWorkout, typeOverride) => {
    if (currentWorkout && currentWorkout.id) {
        return Promise.resolve(currentWorkout);
    }

    return fetch('/api/workouts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ 
            day: day, 
            date: new Date().toISOString().split('T')[0],
            type: typeOverride || currentWorkout.type || day,
            exercises: currentWorkout.exercises || [],
        })
    }).then(res => res.ok ? res.json() : currentWorkout);
  };

  const addExercise = (exerciseName) => {
    console.log('Adding exercise:', exerciseName, 'for', selectedDay);
    if (!exerciseName || !selectedDay) return;

    const currentWorkout = findWorkout(selectedDay);
    if (currentWorkout && currentWorkout.exercises.some(e => e.name.toLowerCase() === exerciseName.toLowerCase())) {
      alert(`${exerciseName} is already in the list for ${selectedDay}.`);
      return;
    }
    
    saveDefaultWorkout(selectedDay, currentWorkout)
      .then(savedWorkout => {
        setWorkouts(prev => prev.map(w => w.day === selectedDay ? savedWorkout : w));
        
        return fetch(`/api/workouts/${selectedDay}/exercises`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ name: exerciseName })
        });
      })
      .then(async (response) => {
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.msg || response.statusText || 'Failed to add exercise.');
        }
        return response.json();
      })
      .then(updatedWorkout => {
        setWorkouts(prev =>
          prev.map(w =>
            w.day === selectedDay ? updatedWorkout : w
          )
        );
        setNewExercise(''); 
      });
  };

  const removeExercise = (exerciseName) => {
    if (!selectedDay) return;

    const currentWorkout = findWorkout(selectedDay);
    
    saveDefaultWorkout(selectedDay, currentWorkout)
      .then(savedWorkout => {
        setWorkouts(prev => prev.map(w => w.day === selectedDay ? savedWorkout : w));

        return fetch(`/api/workouts/${selectedDay}/exercises/${exerciseName}`, {
          method: 'DELETE',
          credentials: 'include'
        });
      })
      .then(async (response) => {
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.msg || response.statusText || 'Failed to remove exercise.');
        }
        return response.json();
      })
      .then(updatedWorkout => {
        setWorkouts(prev =>
          prev.map(w =>
            w.day === selectedDay ? updatedWorkout : w
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

    const currentWorkout = findWorkout(selectedDay);
    
    saveDefaultWorkout(selectedDay, currentWorkout)
      .then(savedWorkout => {
        setWorkouts(prev => prev.map(w => w.day === selectedDay ? savedWorkout : w));

        return fetch(`/api/workouts/${selectedDay}/exercises/${exerciseName}/results`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(resultPayload)
        });
      })
      .then(async (response) => {
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.msg || response.statusText || 'Failed to report result.');
        }
        return response.json();
      })
      .then(updatedWorkout => {
        setWorkouts(prev =>
          prev.map(w =>
            w.day === selectedDay ? updatedWorkout : w
          )
        );
      });
  };

  const updateWorkoutType = (day, newType) => {
    console.log('Updating workout type for', day, 'to', newType);
    const currentWorkout = findWorkout(day);

    saveDefaultWorkout(day, currentWorkout, newType)
        .then(savedWorkout => {
            if (savedWorkout && savedWorkout.id && !currentWorkout.id && savedWorkout.type === newType) {
                 setWorkouts(prev => prev.map(w => w.day === day ? savedWorkout : w));
                 setSelectedDay(savedWorkout.day);
                 return;
            }
            
            return fetch(`/api/workouts/${day}/type`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ type: newType })
            })
            .then(async (response) => {
                if (!response.ok) {
                  const errorData = await response.json().catch(() => ({}));
                  throw new Error(errorData.msg || response.statusText || 'Failed to update workout type.');
                }
                return response.json();
            })
            .then(updatedWorkout => {
                setWorkouts(prev => prev.map(w => w.day === day ? updatedWorkout : w));
                setSelectedDay(updatedWorkout.day); 
            });
        });
  };

  const selectedWorkout = findWorkout(selectedDay);

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

            <ul className="list-unstyled">
              {selectedWorkout.exercises.map((ex) => (
                <li key={ex.name} className="d-flex justify-content-between align-items-center mb-2 p-2 border-bottom">
                  {ex.name} ({ex.results.length} results)
                  <div>
                    <button className="btn btn-sm btn-danger me-1" onClick={() => removeExercise(ex.name)}>−</button>
                    <button className="btn btn-sm btn-info" onClick={() => reportExercise(ex.name)}>Report</button>
                  </div>
                </li>
              ))}
            </ul>

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