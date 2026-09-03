import pg from "pg";
import dotenv from "dotenv";

const { Pool } = pg;

dotenv.config();

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,

    // Connection pool configuration
    max: 10,
    min: 0,
    idleTimeoutMillis: 10000,
    connectionTimeoutMillis: 30000
});

pool.on("connect", () => {
    console.log("PostgreSQL client connected");
});

pool.on("error", (err) => {
    console.error("Unexpected PostgreSQL pool error:", err);
});

const connectToDatabase = async () => {
    try {
        const client = await pool.connect();
        console.log("Connected to the database");

        client.release();
    } catch (err) {
        console.error("Error connecting to the database:", err);
    }
};

export { connectToDatabase, pool };
export default pool;