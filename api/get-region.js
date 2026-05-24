import pg from "pg";
const { Pool } = pg;

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

export default async function handler(req, res) {
  const { lat, lon } = req.query;

  if (!lat || !lon) {
    return res.status(400).json({ error: "Parameter lat dan lon diperlukan" });
  }

  try {
    const result = await pool.query(`
      SELECT 
        nama_kel,
        nama_kec,
        nama_kab
      FROM pulau_jawa
      WHERE ST_Intersects(
        geometry,
        ST_SetSRID(ST_MakePoint($1, $2), 4326)
      )
      LIMIT 1;
    `, [parseFloat(lon), parseFloat(lat)]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Wilayah tidak ditemukan" });
    }

    res.status(200).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
