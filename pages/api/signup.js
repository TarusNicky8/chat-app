// pages/api/signup.js

import bcrypt from 'bcrypt';
import { connectToDatabase } from '../../utils/db';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
      res.status(400).json({ message: 'Username and password are required' });
      return;
    }

    if (password.length < 6) {
      res.status(400).json({ message: 'Password must be at least 6 characters long' });
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const { db } = await connectToDatabase();
    const users = db.collection('users');

    try {
      // Check if user already exists
      const existingUser = await users.findOne({ username });
      if (existingUser) {
        res.status(409).json({ message: 'Username already exists' });
        return;
      }

      // Store user in database
      await users.insertOne({ username, password: hashedPassword });
      res.status(201).json({ message: 'User signed up successfully!' });
    } catch (error) {
      res.status(500).json({ message: 'Failed to sign up user.' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
