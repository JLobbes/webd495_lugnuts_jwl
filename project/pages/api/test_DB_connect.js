
import db from '../../lib/db';

export default async function handler(req, res) {
  try {
    const [rows] = await db.execute('SELECT * FROM users');
    res.status(200).json(rows); // Return the data as JSON
  } catch (err) {
    res.status(500).json({ message: 'Error fetching users', error: err.message });
  }
}
