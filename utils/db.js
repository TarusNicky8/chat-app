

import { MongoClient } from 'mongodb';

if (!process.env.MONGODB_URI) {
  throw new Error('Please add your Mongo URI to .env.local');
}

// a new MongoClient instance with the URI from environment variables
const client = new MongoClient(process.env.MONGODB_URI);

let clientPromise;

if (process.env.NODE_ENV === 'development') {
  if (!global._mongoClientPromise) {
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  clientPromise = client.connect();
}

export async function connectToDatabase() {
  try {
    const client = await clientPromise;
    const db = client.db(); // Get the default database
    return { db, client };
  } catch (error) {
    console.error('Failed to connect to the database', error);
    throw new Error('Failed to connect to the database');
  }
}
