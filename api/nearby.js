import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

export default async function handler(req, res) {
  const { lat, lon, radius = 5000 } = req.query;

  try {
    const result = await pool.query(`
      SELECT *,
      ST_AsGeoJSON(geometry) as geojson
      FROM wilayah_kelurahan
      WHERE ST_DWithin(
        geometry::geography,
        ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography,
        $3
      )
      LIMIT 100;
    `, [lon, lat, radius]);

    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "error" });
  }
}
