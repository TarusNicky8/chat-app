// utils/dbUtils.js

import { connectToDatabase } from './db';

export async function insertMessage(message) {
  const { db } = await connectToDatabase();
  const messages = db.collection('messages');
  const result = await messages.insertOne(message);
  return result;
}

export async function getAllMessages() {
  const { db } = await connectToDatabase();
  const messages = db.collection('messages');
  const allMessages = await messages.find().toArray();
  return allMessages;
}

export async function findUserByUsername(username) {
  const { db } = await connectToDatabase();
  const users = db.collection('users');
  const user = await users.findOne({ username });
  return user;
}

// Add more functions as per your project's requirements
