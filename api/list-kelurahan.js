import pg from "pg";
const { Pool } = pg;

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

export default async function handler(req, res) {
  const { kecamatan } = req.query;

  if (!kecamatan) {
    return res.status(400).json({ error: "Parameter kecamatan diperlukan" });
  }

  try {
    const result = await pool.query(`
      SELECT 
        nama_kel,
        nama_kec,
        nama_kab,
        ST_AsGeoJSON(geometry)::json as geometry
      FROM pulau_jawa
      WHERE nama_kec = $1
      ORDER BY nama_kel ASC
    `, [kecamatan]);

    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
