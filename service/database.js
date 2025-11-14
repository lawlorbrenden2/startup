const { MongoClient } = require('mongodb');
const config = require('./dbConfig.json');

const url = `mongodb+srv://${config.userName}:${config.password}@${config.hostname}`;

const client = new MongoClient(url);
const db = client.db('flexbook');
const userCollection = db.collection('users');
const workoutCollection = db.collection('workouts');
const friendCollection = db.collection('friends');
const reactionCollection = db.collection('reactions');

(async function testConnection() {
  try {
    await db.command({ ping: 1 });
    console.log(`Connected to database`);
  } catch (ex) {
    console.log(`Unable to connect to database with ${url} because ${ex.message}`);
    process.exit(1);
  }
})();

function getUser(email) {
  return userCollection.findOne({ email });
}

function getUserByToken(token) {
  return userCollection.findOne({ token });
}

async function addUser(user) {
  await userCollection.insertOne(user);
}

async function updateUser(user) {
  await userCollection.updateOne({ email: user.email }, { $set: user });
}

function getWorkouts(email) {
  return workoutCollection.find({ userEmail: email }).toArray();
}

function getWorkout(userEmail, day) {
  return workoutCollection.findOne({ userEmail, day });
}

async function saveWorkout(workout) {
  await workoutCollection.updateOne(
    { userEmail: workout.userEmail, day: workout.day },
    { $set: workout },
    { upsert: true }
  );
}

async function updateWorkout(workout) {
  await saveWorkout(workout);
}

function getFriends(email) {
  return friendCollection.find({ userEmail: email }).toArray();
}

async function friendExists(userEmail, friendEmail) {
  const existing = await friendCollection.findOne({ userEmail, friendEmail });
  return !!existing;
}

async function addFriend(friend) {
  await friendCollection.insertOne(friend);
}


function getReactions(email) {
  return reactionCollection.find({ receiverEmail: email }).toArray();
}

async function addReaction(reaction) {
  await reactionCollection.insertOne(reaction);
}

module.exports = {
  getUser,
  getUserByToken,
  addUser,
  updateUser,
  getWorkouts,
  getWorkout,
  saveWorkout,
  updateWorkout,
  getFriends,
  friendExists,
  addFriend,
  getReactions,
  addReaction,
};
