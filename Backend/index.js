import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectToDatabase, pool } from "./src/config/database.js";
import authRoute from './src/routes/auth.route.js';
import usersRoutes from './src/routes/users.routes.js';
import storesRoutes from './src/routes/stores.routes.js';
import ratingsRoutes from './src/routes/ratings.routes.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoute);
app.use('/api/users', usersRoutes);
app.use('/api/stores', storesRoutes);
app.use('/api/ratings', ratingsRoutes);

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