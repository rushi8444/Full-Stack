import express from "express";
import dotenv from "dotenv";
import { connectToDatabase, pool } from "./src/config/database.js";
import authRoutes from "./src/routes/auth.route.js";

dotenv.config();

const app = express();

app.use(express.json());

app.use('/', authRoutes);

const startServer = async () => {
    try {
        await connectToDatabase();

        app.listen(process.env.PORT, () => {
            console.log(
                `Server is running on http://localhost:${process.env.PORT}`
            );
        });
    } catch (error) {
        console.error("Failed to start server:", error);
        process.exit(1);
    }
};

const shutdown = async () => {
    console.log("Shutting down server...");

    await pool.end();

    console.log("Database pool closed");

    process.exit(0);
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

startServer();