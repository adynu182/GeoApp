import pg from "pg";
const { Pool } = pg;

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

export default async function handler(req, res) {
  const { q } = req.query;

  if (!q || q.length < 3) {
    return res.status(200).json([]);
  }

  try {
    const searchTerm = `%${q}%`;
    const result = await pool.query(`
      SELECT 
        nama_kel,
        nama_kec,
        nama_kab,
        ST_AsGeoJSON(geometry)::json as geometry
      FROM pulau_jawa
      WHERE 
        nama_kel ILIKE $1 OR 
        nama_kec ILIKE $1 OR 
        nama_kab ILIKE $1
      LIMIT 50;
    `, [searchTerm]);

    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
