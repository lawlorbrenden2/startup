const { MongoClient } = require('mongodb');
const config = require('./dbConfig.json');

const url = `mongodb+srv://${config.userName}:${config.password}@${config.hostname}`;

// Connect to the database cluster
const client = new MongoClient(url);
const db = client.db('flexbook');
const userCollection = db.collection('users');
const workoutCollection = db.collection('workouts');
const friendCollection = db.collection('friends');
const reactionCollection = db.collection('reactions');

(async function testConnection() {
  try {
    await db.command({ ping: 1 });
    console.log(`Connect to database`);
  } catch (ex) {
    console.log(`Unable to connect to database with ${url} because ${ex.message}`);
    process.exit(1);
  }
})();

function getUser(email) {
  return userCollection.findOne({ email: email });
}

function getUserByToken(token) {
  return userCollection.findOne({ token: token });
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

async function saveWorkout(workout) {
  await workoutCollection.updateOne(
    { userEmail: workout.userEmail, day: workout.day },
    { $set: workout },
    { upsert: true }
  );
}

function getFriends(email) {
    return friendCollection.find({ userEmail: email }).toArray();
}

async function addFriend(friend) {
    await friendCollection.insertOne(friend);
}

function getReactions(email) {
    return reactionCollection.find({ userEmail: email }).toArray();
}

module.exports = {
  getUser,
  getUserByToken,
  addUser,
  updateUser,
  getWorkouts,
  saveWorkout,
  getFriends,
  addFriend,
  getReactions,
  addReaction,
};