import pg from "pg";

const { Pool } = pg;

//paksa ignore SSL global
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

export default async function handler(req, res) {
  const { lat, lon, radius = 5000 } = req.query;

  try {
    const result = await pool.query(`
      SELECT 
        nama_kel,
        nama_kec,
        nama_kab,
        ST_AsGeoJSON(geometry)::json as geometry
      FROM pulau_jawa WHERE ST_DWithin(
      geometry::geography,
      ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography,
      $3
      )
    `);

    res.status(200).json(result.rows);
  } catch (err) {
    console.error("ERROR:", err);
    res.status(500).json({ error: err.message });
  }
}
