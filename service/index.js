const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const express = require('express');
const uuid = require('uuid');
const app = express();
const DB = require('./database.js'); // Your DB module

const authCookieName = 'token';
const port = process.argv.length > 2 ? process.argv[2] : 4000;

app.use(express.json());
app.use(cookieParser());
app.use(express.static('public'));

const apiRouter = express.Router();
app.use('/api', apiRouter);

// Create a new user
async function createUser(email, password) {
  const passwordHash = await bcrypt.hash(password, 10);
  const user = { email, password: passwordHash, token: uuid.v4() };
  await DB.addUser(user);
  return user;
}

// Find user by email or token
async function findUser(field, value) {
  if (!value) return null;
  if (field === 'token') return DB.getUserByToken(value);
  return DB.getUser(value);
}

// Set authentication cookie
function setAuthCookie(res, authToken) {
  res.cookie(authCookieName, authToken, {
    maxAge: 1000 * 60 * 60 * 24 * 365,
    secure: true,
    httpOnly: true,
    sameSite: 'strict',
  });
}

// Authentication Routes
apiRouter.post('/auth/create', async (req, res) => {
  try {
    if (await findUser('email', req.body.email)) {
      return res.status(409).send({ msg: 'Existing user' });
    }
    const user = await createUser(req.body.email, req.body.password);
    setAuthCookie(res, user.token);
    res.send({ email: user.email });
  } catch (err) {
    console.error(err);
    res.status(500).send({ msg: 'Failed to create user' });
  }
});

// Login user
apiRouter.post('/auth/login', async (req, res) => {
  try {
    const user = await findUser('email', req.body.email);
    if (user && await bcrypt.compare(req.body.password, user.password)) {
      user.token = uuid.v4();
      await DB.updateUser(user); // Save updated token
      setAuthCookie(res, user.token);
      return res.send({ email: user.email });
    }
    res.status(401).send({ msg: 'Unauthorized' });
  } catch (err) {
    console.error(err);
    res.status(500).send({ msg: 'Login failed' });
  }
});

// Log out user
apiRouter.delete('/auth/logout', async (req, res) => {
  try {
    const user = await findUser('token', req.cookies[authCookieName]);
    if (user) {
      delete user.token;
      await DB.updateUser(user);
    }
    res.clearCookie(authCookieName);
    res.status(204).end();
  } catch (err) {
    console.error(err);
    res.status(500).send({ msg: 'Logout failed' });
  }
});

// Middleware to verify authentication
const verifyAuth = async (req, res, next) => {
  try {
    const user = await findUser('token', req.cookies[authCookieName]);
    if (!user) return res.status(401).send({ msg: 'Unauthorized' });
    req.user = user;
    next();
  } catch (err) {
    console.error(err);
    res.status(500).send({ msg: 'Auth verification failed' });
  }
};

// Workout Routes
apiRouter.get('/workouts', verifyAuth, async (req, res) => {
  try {
    const workouts = await DB.getWorkouts(req.user.email);
    res.send(workouts);
  } catch (err) {
    console.error(err);
    res.status(500).send({ msg: 'Failed to fetch workouts' });
  }
});

// Save a workout
apiRouter.post('/workouts', verifyAuth, async (req, res) => {
  try {
    const { day, date, type, exercises = [], notes = '' } = req.body;
    if (!day) return res.status(400).send({ msg: 'Missing day identifier' });

    let workout = await DB.getWorkout(req.user.email, day);
    if (workout) {
      workout.date = date || workout.date;
      workout.type = type || workout.type;
      workout.notes = notes || workout.notes;
      await DB.updateWorkout(workout);
    } else {
      workout = {
        id: uuid.v4(),
        userEmail: req.user.email,
        day,
        name: day,
        date,
        type: type || day,
        exercises,
        notes,
      };
      await DB.saveWorkout(workout);
    }
    res.send(workout);
  } catch (err) {
    console.error(err);
    res.status(500).send({ msg: 'Failed to save workout' });
  }
});

// Exercise Routes
apiRouter.post('/workouts/:day/exercises', verifyAuth, async (req, res) => {
  try {
    const day = req.params.day;
    const { name, notes = '' } = req.body;
    if (!name) return res.status(400).send({ msg: 'Missing exercise name' });

    const workout = await DB.getWorkout(req.user.email, day);
    if (!workout) return res.status(404).send({ msg: 'Workout not found' });

    if (workout.exercises.some(e => e.name.toLowerCase() === name.toLowerCase())) {
      return res.status(409).send({ msg: 'Exercise already exists in this workout' });
    }

    const exercise = { id: uuid.v4(), name, notes, results: [] };
    workout.exercises.push(exercise);
    await DB.updateWorkout(workout);

    res.send(workout);
  } catch (err) {
    console.error(err);
    res.status(500).send({ msg: 'Failed to add exercise' });
  }
});

// Delete an exercise
apiRouter.delete('/workouts/:day/exercises/:exerciseName', verifyAuth, async (req, res) => {
  try {
    const { day, exerciseName } = req.params;
    const workout = await DB.getWorkout(req.user.email, day);
    if (!workout) return res.status(404).send({ msg: 'Workout not found' });

    const initialLength = workout.exercises.length;
    workout.exercises = workout.exercises.filter(e => e.name.toLowerCase() !== exerciseName.toLowerCase());
    if (workout.exercises.length === initialLength) return res.status(404).send({ msg: 'Exercise not found' });

    await DB.updateWorkout(workout);
    res.send(workout);
  } catch (err) {
    console.error(err);
    res.status(500).send({ msg: 'Failed to delete exercise' });
  }
});

// Add result to an exercise
apiRouter.post('/workouts/:day/exercises/:exerciseName/results', verifyAuth, async (req, res) => {
  try {
    const { day, exerciseName } = req.params;
    const { value, date = new Date().toISOString().split('T')[0] } = req.body;

    const workout = await DB.getWorkout(req.user.email, day);
    if (!workout) return res.status(404).send({ msg: 'Workout not found' });

    const exercise = workout.exercises.find(e => e.name.toLowerCase() === exerciseName.toLowerCase());
    if (!exercise) return res.status(404).send({ msg: 'Exercise not found' });

    exercise.results.push({ value, date });
    await DB.updateWorkout(workout);

    res.send(workout);
  } catch (err) {
    console.error(err);
    res.status(500).send({ msg: 'Failed to add result' });
  }
});

// Update workout type
apiRouter.put('/workouts/:day/type', verifyAuth, async (req, res) => {
  try {
    const { day } = req.params;
    const { type } = req.body;

    const workout = await DB.getWorkout(req.user.email, day);
    if (!workout) return res.status(404).send({ msg: 'Workout not found' });

    workout.type = type;
    await DB.updateWorkout(workout);

    res.send(workout);
  } catch (err) {
    console.error(err);
    res.status(500).send({ msg: 'Failed to update workout type' });
  }
});

// Friend Routes
apiRouter.get('/friends', verifyAuth, async (req, res) => {
  try {
    const friends = await DB.getFriends(req.user.email);
    const friendEmails = friends.map(f => f.friendEmail);
    res.send(friendEmails);
  } catch (err) {
    console.error(err);
    res.status(500).send({ msg: 'Failed to fetch friends' });
  }
});

// Add a friend
apiRouter.post('/friends', verifyAuth, async (req, res) => {
  try {
    const friendEmail = req.body.friendEmail;
    if (!friendEmail) return res.status(400).send({ msg: 'Missing friendEmail' });

    const exists = await DB.friendExists(req.user.email, friendEmail);
    if (exists) return res.status(409).send({ msg: 'Friend already added' });

    const newFriend = { userEmail: req.user.email, friendEmail };
    await DB.addFriend(newFriend);
    res.send(newFriend);
  } catch (err) {
    console.error(err);
    res.status(500).send({ msg: 'Failed to add friend' });
  }
});

// Reaction Routes
apiRouter.post('/reactions', verifyAuth, async (req, res) => {
  try {
    const { friendEmail, exerciseName, emoji } = req.body;
    if (!friendEmail || !exerciseName || !emoji) return res.status(400).send({ msg: 'Missing reaction data' });

    const newReaction = {
      id: uuid.v4(),
      senderEmail: req.user.email,
      receiverEmail: friendEmail,
      exerciseName,
      emoji,
      timestamp: new Date().toISOString(),
    };

    await DB.addReaction(newReaction);
    res.send(newReaction);
  } catch (err) {
    console.error(err);
    res.status(500).send({ msg: 'Failed to add reaction' });
  }
});

// Get reactions for the user
apiRouter.get('/reactions', verifyAuth, async (req, res) => {
  try {
    const reactions = await DB.getReactions(req.user.email);
    res.send(reactions);
  } catch (err) {
    console.error(err);
    res.status(500).send({ msg: 'Failed to fetch reactions' });
  }
});

// Default error handler
app.use((err, req, res, next) => {
  res.status(500).send({ type: err.name, message: err.message });
});

app.use((_req, res) => {
  res.sendFile('index.html', { root: 'public' });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
