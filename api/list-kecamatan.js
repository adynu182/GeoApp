import pg from "pg";
const { Pool } = pg;

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

export default async function handler(req, res) {
  try {
    const result = await pool.query(`
      SELECT DISTINCT nama_kec 
      FROM pulau_jawa 
      WHERE nama_kec IS NOT NULL 
      ORDER BY nama_kec ASC
    `);
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
