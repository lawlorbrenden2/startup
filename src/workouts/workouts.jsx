import React from 'react';

export function Workouts() {

  const [workouts, setWorkouts] = React.useState([
  { day: 'Monday', type: 'Push', exercises: ['Bench Press', 'Overhead Press'] },
  { day: 'Tuesday', type: 'Pull', exercises: ['Pull Ups', 'Rows'] },
  { day: 'Wednesday', type: 'Legs', exercises: ['Squat', 'Deadlift'] },
  { day: 'Thursday', type: 'Push', exercises: ['Incline Bench', 'Dips'] },
  { day: 'Friday', type: 'Pull', exercises: ['Chin Ups', 'Bicep Curls'] },
  { day: 'Saturday', type: 'Legs', exercises: ['Lunges', 'Leg Press'] },
  { day: 'Sunday', type: 'Rest', exercises: [] },
]);

  const [selectedDay, setSelectedDay] = React.useState(null);

  const currentDay = new Date().toLocaleDateString('en-US', { weekday: 'long' });

  const selectDay = (day) => {
    setSelectedDay(day);
  };

  return (
    <main className="container-fluid bg-dark text-light d-flex flex-column align-items-center mt-5 pt-3">
      <div className="content-wrapper w-75">
        <h2>My Workout Plan</h2>

        <table className="table table-hover mt-3">
          <thead>
            <tr>
              <th scope="col">Day</th>
              <th scope="col">Workout Type</th>
            </tr>
          </thead>
          <tbody>
            <tr className="table-active"> <td>Monday</td>
              <td>Push</td>
            </tr>
            <tr>
              <td>Tuesday</td>
              <td>Pull</td>
            </tr>
            <tr>
              <td>Wednesday</td>
              <td>Legs</td>
            </tr>
            <tr>
              <td>Thursday</td>
              <td>Push</td>
            </tr>
            <tr>
              <td>Friday</td>
              <td>Pull</td>
            </tr>
            <tr>
              <td>Saturday</td>
              <td>Legs</td>
            </tr>
            <tr>
              <td>Sunday</td>
              <td>Rest</td>
            </tr>
          </tbody>
        </table>

        <div className="exercise-details mt-3 text-light">
          <p>Click a day to view exercises for that day</p>
        </div>
      </div>
    </main>
  );
}