// src/utils/db.js

import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const options = {};

if (!uri) {
  throw new Error('Please add your Mongo URI to .env.local');
}

let client;
let clientPromise;

if (process.env.NODE_ENV === 'development') {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export async function connectToDatabase() {
  try {
    const clientConnection = await clientPromise; // Ensure the client is connected before returning
    return {
      client: clientConnection,
      db: clientConnection.db('app-data'),
    };
  } catch (error) {
    console.error('Error connecting to the database:', error);
    throw error;
  }
}

export { clientPromise };
