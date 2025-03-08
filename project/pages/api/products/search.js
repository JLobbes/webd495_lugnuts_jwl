import db from '../../../lib/db';

export default async function handler(req, res) {
  const { method } = req;

  // ensure request is not POST
  if (method === 'GET') {
    const { query } = req.query;

    // make everything lowercase
    const lowercaseQuery = query ? query.toLowerCase() : '';

    if (!lowercaseQuery) {
      return res.status(400).json({ error: 'Query is required' });
    }

    // split query into keywords
    const keywords = lowercaseQuery.split(' ').map(word => `%${word}%`);
    
    // make base SQL query to add to
    let sql = 'SELECT * FROM PRODUCTS WHERE 1=1';
    let parameters = [];

    // prepare search conditions for SQL query
    const searchConditions = keywords.map(() => '(PRODUCT_NAME LIKE ? OR PRODUCT_DESCRIPTION LIKE ?)');
    sql += ' AND (' + searchConditions.join(' AND ') + ')';

    keywords.forEach(keyword => {
      parameters.push(keyword);
      parameters.push(keyword);  // this must loop twice to search description & name
    });

    try {
      const [products] = await db.query(sql, parameters);
      res.status(200).json(products);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
