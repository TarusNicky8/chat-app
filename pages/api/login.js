

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { connectToDatabase } from '../../src/utils/db';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { username, password } = req.body;

    if (!username || !password) {
      console.log('Missing username or password');
      return res.status(400).json({ message: 'Username and password are required' });
    }

    try {
      const { db } = await connectToDatabase();
      const users = db.collection('users');

      const user = await users.findOne({ username });

      if (!user) {
        console.log('User not found');
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        console.log('Invalid password');
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const token = jwt.sign(
        { username },
        process.env.JWT_SECRET || 'your_secret_key', 
        { expiresIn: '1h' }
      );

      console.log('Login successful, token generated');
      return res.status(200).json({ token });
    } catch (error) {
      console.error('Error during login:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
