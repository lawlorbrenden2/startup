const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const express = require('express');
const uuid = require('uuid');
const app = express();

const authCookieName = 'token';

let users = [];
let workouts = [];
let friendsList = [];
let reactions = [];

const port = process.argv.length > 2 ? process.argv[2] : 4000;

app.use(express.json());
app.use(cookieParser());
app.use(express.static('public'));

const apiRouter = express.Router();
app.use('/api', apiRouter);


async function createUser(email, password) {
  const passwordHash = await bcrypt.hash(password, 10);
  const user = { email, password: passwordHash, token: uuid.v4() };
  users.push(user);
  return user;
}

async function findUser(field, value) {
  if (!value) return null;
  return users.find(u => u[field] === value);
}

// setAuthCookie in the HTTP response
function setAuthCookie(res, authToken) {
  res.cookie(authCookieName, authToken, {
    maxAge: 1000 * 60 * 60 * 24 * 365,
    secure: true,
    httpOnly: true,
    sameSite: 'strict',
  });
}

const findUserWorkout = (userEmail, dayIdentifier) => {
    const lowerIdentifier = dayIdentifier.toLowerCase();
    return workouts.find(w => w.userEmail === userEmail && w.name.toLowerCase() === lowerIdentifier);
};

const verifyAuth = async (req, res, next) => {
  const user = await findUser('token', req.cookies[authCookieName]);
  
  if (!user) {
    return res.status(401).send({ msg: 'Unauthorized' });
  }
  
  req.user = user;
  next();
};

apiRouter.post('/auth/create', async (req, res) => {
  if (await findUser('email', req.body.email)) {
    return res.status(409).send({ msg: 'Existing user' });
  }
  const user = await createUser(req.body.email, req.body.password);
  setAuthCookie(res, user.token);
  res.send({ email: user.email });
});

apiRouter.post('/auth/login', async (req, res) => {
  const user = await findUser('email', req.body.email);
  if (user && await bcrypt.compare(req.body.password, user.password)) {
    user.token = uuid.v4();
    setAuthCookie(res, user.token);
    return res.send({ email: user.email });
  }
  res.status(401).send({ msg: 'Unauthorized' });
});

apiRouter.delete('/auth/logout', async (req, res) => {
  const user = await findUser('token', req.cookies[authCookieName]);
  if (user) delete user.token;
  res.clearCookie(authCookieName);
  res.status(204).end();
});

apiRouter.get('/workouts', verifyAuth, (req, res) => {
  const userWorkouts = workouts.filter(w => w.userEmail === req.user.email);
  res.send(userWorkouts);
});

apiRouter.post('/workouts', verifyAuth, (req, res) => {
  const incomingWorkoutData = req.body;
  const userEmail = req.user.email;
  const workoutDayIdentifier = incomingWorkoutData.day; 
  
  let workout = findUserWorkout(userEmail, workoutDayIdentifier);

  if (workout) {
    workout.date = incomingWorkoutData.date || workout.date;
    workout.type = incomingWorkoutData.type || workout.type;
    workout.notes = incomingWorkoutData.notes || workout.notes;
  } else {
    workout = {
      id: uuid.v4(),
      userEmail: userEmail,
      day: workoutDayIdentifier, 
      name: workoutDayIdentifier, 
      date: incomingWorkoutData.date,
      type: incomingWorkoutData.type || workoutDayIdentifier,
      exercises: incomingWorkoutData.exercises || [],
      notes: incomingWorkoutData.notes || ''
    };
    workouts.push(workout);
  }
  
  res.send(workout);
});


apiRouter.post('/workouts/:day/exercises', verifyAuth, (req, res) => {
  const workoutDayIdentifier = req.params.day;
  const newExerciseName = req.body.name;
  
  const workout = findUserWorkout(req.user.email, workoutDayIdentifier);
  if (!workout) return res.status(404).send({ msg: 'Workout not found' });
  if (workout.exercises.some(e => e.name.toLowerCase() === newExerciseName.toLowerCase())) {
     return res.status(409).send({ msg: 'Exercise already exists in this workout' });
  }

  const exercise = {
    id: uuid.v4(),
    name: newExerciseName,
    notes: req.body.notes || '',
    results: []
  };
  workout.exercises.push(exercise);
  
  res.send(workout); 
});

apiRouter.delete('/workouts/:day/exercises/:exerciseName', verifyAuth, (req, res) => {
  const workoutDayIdentifier = req.params.day;
  const exerciseName = req.params.exerciseName;

  const workout = findUserWorkout(req.user.email, workoutDayIdentifier);
  if (!workout) return res.status(404).send({ msg: 'Workout not found' });

  const initialLength = workout.exercises.length;
  workout.exercises = workout.exercises.filter(e => e.name.toLowerCase() !== exerciseName.toLowerCase());

  if (workout.exercises.length === initialLength) return res.status(404).send({ msg: 'Exercise not found' });

  res.send(workout);
});

apiRouter.post('/workouts/:day/exercises/:exerciseName/results', verifyAuth, (req, res) => {
  const workoutDayIdentifier = req.params.day;
  const exerciseName = req.params.exerciseName;

  const workout = findUserWorkout(req.user.email, workoutDayIdentifier);
  if (!workout) return res.status(404).send({ msg: 'Workout not found' });

  const exercise = workout.exercises.find(e => e.name.toLowerCase() === exerciseName.toLowerCase());
  if (!exercise) return res.status(404).send({ msg: 'Exercise not found' });

  const result = {
    value: req.body.value,
    date: req.body.date || new Date().toISOString().split('T')[0]
  };
  exercise.results.push(result);
  
  res.send(workout);
});

apiRouter.put('/workouts/:day/type', verifyAuth, (req, res) => {
  const workoutDayIdentifier = req.params.day;
  const newType = req.body.type;

  const workout = findUserWorkout(req.user.email, workoutDayIdentifier);
  if (!workout) return res.status(404).send({ msg: 'Workout not found' });

  workout.type = newType;

  res.send(workout);
});


apiRouter.get('/friends', verifyAuth, (req, res) => {
  const userEmail = req.user.email;
  const userFriends = friendsList
    .filter(f => f.userEmail === userEmail)
    .map(f => f.friendEmail);
    
  res.send(userFriends);
});

apiRouter.post('/friends', verifyAuth, (req, res) => {
  const userEmail = req.user.email;
  const friendEmail = req.body.friendEmail;

  if (!friendEmail) {
    return res.status(400).send({ msg: 'Missing friendEmail' });
  }

  if (friendsList.some(f => f.userEmail === userEmail && f.friendEmail === friendEmail)) {
    return res.status(409).send({ msg: 'Friend already added' });
  }

  const newFriend = {
    userEmail: userEmail,
    friendEmail: friendEmail
  };

  friendsList.push(newFriend);
  res.send(newFriend);
});

apiRouter.post('/reactions', verifyAuth, (req, res) => {
  const senderEmail = req.user.email;
  const { friendEmail, exerciseName, emoji } = req.body;

  if (!friendEmail || !exerciseName || !emoji) {
    return res.status(400).send({ msg: 'Missing reaction data' });
  }

  const newReaction = {
    id: uuid.v4(),
    senderEmail: senderEmail,
    receiverEmail: friendEmail,
    exerciseName: exerciseName,
    emoji: emoji,
    timestamp: new Date().toISOString()
  };

  reactions.push(newReaction);
  res.send(newReaction);
});

apiRouter.get('/reactions', verifyAuth, (req, res) => {
  const userEmail = req.user.email;
  const receivedReactions = reactions.filter(r => r.receiverEmail === userEmail);
  res.send(receivedReactions);
});

app.use((err, req, res, next) => {
  res.status(500).send({ type: err.name, message: err.message });
});


app.use((_req, res) => {
  res.sendFile('index.html', { root: 'public' });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});