// pages/api/getUser.js

import { verifyToken } from '../../src/utils/auth'; // Adjust the path as necessary

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const token = req.headers.authorization?.split(' ')[1]; // Extract token from Authorization header

    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    try {
      const decoded = await verifyToken(token);
      res.status(200).json({ username: decoded.username });
    } catch (error) {
      console.error('Error verifying token:', error);
      res.status(401).json({ message: 'Invalid token' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
