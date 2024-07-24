

import bcrypt from 'bcrypt';
import { connectToDatabase } from '../../src/utils/db';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    try {
      const { db } = await connectToDatabase();
      const users = db.collection('users');

      // Check if the user already exists
      const existingUser = await users.findOne({ username });
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insert the new user
      const newUser = {
        username,
        password: hashedPassword,
      };
      await users.insertOne(newUser);

      return res.status(201).json({ message: 'User signed up successfully' });
    } catch (error) {
      console.error('Error during signup:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
