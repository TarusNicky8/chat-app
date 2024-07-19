import { connectToDatabase } from '../../src/utils/db';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const { db } = await connectToDatabase();
      if (!db) {
        throw new Error('Database connection failed');
      }
      const messages = await db.collection('messages').find().toArray();
      res.status(200).json(messages);
    } catch (error) {
      console.error('Error fetching messages:', error);
      res.status(500).json({ message: 'Failed to fetch messages' });
    }
  } else if (req.method === 'POST') {
    const { sender, content } = req.body;

    if (!sender || !content) {
      console.error('Missing sender or content');
      return res.status(400).json({ message: 'Sender and content are required' });
    }

    const newMessage = {
      sender,
      content,
      timestamp: new Date().toISOString(),
    };

    try {
      const { db } = await connectToDatabase();
      if (!db) {
        throw new Error('Database connection failed');
      }
      const result = await db.collection('messages').insertOne(newMessage);
      const savedMessage = await db.collection('messages').findOne({ _id: result.insertedId });
      res.status(201).json(savedMessage);
    } catch (error) {
      console.error('Error saving message:', error);
      res.status(500).json({ message: 'Failed to save message' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
