

import { verifyToken } from '../../src/utils/auth';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ valid: false });
    }

    try {
      await verifyToken(token);
      res.status(200).json({ valid: true });
    } catch (error) {
      console.error('Token verification failed:', error);
      res.status(401).json({ valid: false });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
