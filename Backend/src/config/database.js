import pg from "pg";
import dotenv from "dotenv";

const { Pool } = pg;

dotenv.config();

let dbHost = process.env.DB_HOST;
let dbUser = process.env.DB_USER;
let connectionString = process.env.DATABASE_URL;

// Supabase direct host (db.<ref>.supabase.co) only resolves to IPv6.
// Cloud providers like Render do not support outbound IPv6, which causes "ENETUNREACH".
// Automatically route to the Supabase IPv4 connection pooler (aws-0-ap-south-1.pooler.supabase.com)
if (dbHost && dbHost.startsWith("db.") && dbHost.includes(".supabase.co")) {
    const projectRef = dbHost.split(".")[1];
    dbHost = "aws-0-ap-south-1.pooler.supabase.com";
    if (dbUser === "postgres") {
        dbUser = `postgres.${projectRef}`;
    }
}

if (connectionString && connectionString.includes(".supabase.co")) {
    const match = connectionString.match(/db\.([a-zA-Z0-9]+)\.supabase\.co/);
    if (match) {
        const projectRef = match[1];
        connectionString = connectionString
            .replace(/postgres:([^@]+)@db\.[a-zA-Z0-9]+\.supabase\.co/, `postgres.${projectRef}:$1@aws-0-ap-south-1.pooler.supabase.com`)
            .replace(`db.${projectRef}.supabase.co`, "aws-0-ap-south-1.pooler.supabase.com");
    }
}

const isRemoteOrSupabase =
    dbHost?.includes("supabase") ||
    connectionString?.includes("supabase") ||
    process.env.NODE_ENV === "production" ||
    process.env.DB_SSL === "true";

const poolConfig = connectionString
    ? {
          connectionString,
          ssl: isRemoteOrSupabase ? { rejectUnauthorized: false } : false,
      }
    : {
          user: dbUser,
          host: dbHost,
          database: process.env.DB_NAME,
          password: process.env.DB_PASSWORD,
          port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 5432,
          ssl: isRemoteOrSupabase ? { rejectUnauthorized: false } : false,
      };

const pool = new Pool({
    ...poolConfig,
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