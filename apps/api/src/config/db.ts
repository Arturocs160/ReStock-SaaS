import pg from "pg";
import dotenv from "dotenv";

dotenv.config({ override: true });
// If NODE_ENV is development, also try loading .env.development explicitly just in case
if (process.env.NODE_ENV === "development") {
  dotenv.config({ path: ".env.development", override: true });
}

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  // ssl: {
  //     rejectUnauthorized: false,
  // }
});

export default pool;
