const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const express = require('express');
const uuid = require('uuid');
const app = express();

const authCookieName = 'token';

// In-memory storage
let users = [];
let workouts = [];

const port = process.argv.length > 2 ? process.argv[2] : 4000;

app.use(express.json());
app.use(cookieParser());
app.use(express.static('public'));


const apiRouter = express.Router();
app.use('/api', apiRouter);


// Create user
apiRouter.post('/auth/create', async (req, res) => {
  if (await findUser('email', req.body.email)) {
    return res.status(409).send({ msg: 'Existing user' });
  }
  const user = await createUser(req.body.email, req.body.password);
  setAuthCookie(res, user.token);
  res.send({ email: user.email });
});

// Login
apiRouter.post('/auth/login', async (req, res) => {
  const user = await findUser('email', req.body.email);
  if (user && await bcrypt.compare(req.body.password, user.password)) {
    user.token = uuid.v4();
    setAuthCookie(res, user.token);
    return res.send({ email: user.email });
  }
  res.status(401).send({ msg: 'Unauthorized' });
});

// Logout
apiRouter.delete('/auth/logout', async (req, res) => {
  const user = await findUser('token', req.cookies[authCookieName]);
  if (user) delete user.token;
  res.clearCookie(authCookieName);
  res.status(204).end();
});

// Middleware to verify authentication
const verifyAuth = async (req, res, next) => {
  const user = await findUser('token', req.cookies[authCookieName]);
  if (!user) return res.status(401).send({ msg: 'Unauthorized' });
  req.user = user; // attach for convenience
  next();
};


// Get all workouts for logged-in user
apiRouter.get('/workouts', verifyAuth, (req, res) => {
  const userWorkouts = workouts.filter(w => w.userEmail === req.user.email);
  res.send(userWorkouts);
});

// Add a new workout
apiRouter.post('/workouts', verifyAuth, (req, res) => {
  const workout = {
    id: uuid.v4(),
    userEmail: req.user.email,
    name: req.body.name,
    date: req.body.date,
    exercises: [],
    notes: req.body.notes || ''
  };
  workouts.push(workout);
  res.send(workout);
});

// Add an exercise to a workout
apiRouter.post('/workouts/:workoutId/exercises', verifyAuth, (req, res) => {
  const workout = workouts.find(w => w.id === req.params.workoutId && w.userEmail === req.user.email);
  if (!workout) return res.status(404).send({ msg: 'Workout not found' });

  const exercise = {
    id: uuid.v4(),
    name: req.body.name,
    notes: req.body.notes || '',
    results: []
  };
  workout.exercises.push(exercise);
  res.send(exercise);
});

// Report a result for an exercise
apiRouter.post('/workouts/:workoutId/exercises/:exerciseId/results', verifyAuth, (req, res) => {
  const workout = workouts.find(w => w.id === req.params.workoutId && w.userEmail === req.user.email);
  if (!workout) return res.status(404).send({ msg: 'Workout not found' });

  const exercise = workout.exercises.find(e => e.id === req.params.exerciseId);
  if (!exercise) return res.status(404).send({ msg: 'Exercise not found' });

  const result = {
    value: req.body.value,
    date: req.body.date || new Date().toISOString().split('T')[0]
  };
  exercise.results.push(result);
  res.send(exercise);
});


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

function setAuthCookie(res, token) {
  res.cookie(authCookieName, token, {
    maxAge: 1000 * 60 * 60 * 24 * 365,
    secure: false,
    httpOnly: true,
    sameSite: 'strict'
  });
}

app.use((err, req, res, next) => {
  res.status(500).send({ type: err.name, message: err.message });
});


app.use((_req, res) => {
  res.sendFile('index.html', { root: 'public' });
});


app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
