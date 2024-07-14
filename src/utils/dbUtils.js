// utils/dbUtils.js

import { connectToDatabase } from './db';

export async function insertMessage(message) {
  const client = await connectToDatabase();
  const db = client.db('app-data'); // Explicitly specifying the database name
  const messages = db.collection('messages');
  const result = await messages.insertOne(message);
  return result;
}

export async function getAllMessages() {
  const client = await connectToDatabase();
  const db = client.db('app-data'); // Explicitly specifying the database name
  const messages = db.collection('messages');
  const allMessages = await messages.find().toArray();
  return allMessages;
}

export async function findUserByUsername(username) {
  const client = await connectToDatabase();
  const db = client.db('app-data'); // Explicitly specifying the database name
  const users = db.collection('users');
  const user = await users.findOne({ username });
  return user;
}


