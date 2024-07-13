// pages/api/messages.js

import { connectToDatabase } from '../../utils/db';

export default async function handler(req, res) {
  const { db } = await connectToDatabase();
  const messages = db.collection('messages');

  if (req.method === 'POST') {
    const { username, content } = req.body;
    const message = { username, content, timestamp: new Date() };

    try {
      const result = await messages.insertOne(message);
      message._id = result.insertedId;
      res.status(201).json(message);
    } catch (error) {
      res.status(500).json({ message: 'Failed to store message.' });
    }
  } else if (req.method === 'GET') {
    try {
      const allMessages = await messages.find({}).toArray();
      res.status(200).json(allMessages);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch messages.' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
