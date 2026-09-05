import db from "../config/database.js";

class RatingModel {

    // Create a user's only rating for a store
    static async create({ userId, storeId, rating }) {
        const query = `
            INSERT INTO ratings (
                user_id,
                store_id,
                rating
            )
            VALUES ($1, $2, $3)
            ON CONFLICT (user_id, store_id)
            DO UPDATE SET
                rating = EXCLUDED.rating,
                updated_at = CURRENT_TIMESTAMP
            RETURNING
                id,
                user_id,
                store_id,
                rating,
                updated_at;
        `;

        const { rows } = await db.query(query, [
            userId,
            storeId,
            rating
        ]);

        return rows[0];
    }

    // Store Owner Dashboard:
    // Get store average rating and users who rated the store
    static async findByStoreOwner(ownerId) {

        // Get store and average rating
        const avgQuery = `
            SELECT
                s.id AS store_id,
                s.name AS store_name,
                COALESCE(
                    AVG(r.rating),
                    0
                )::NUMERIC(3, 2) AS average_rating

            FROM stores s

            LEFT JOIN ratings r
                ON s.id = r.store_id

            WHERE s.owner_id = $1

            GROUP BY
                s.id,
                s.name;
        `;

        // Get users who submitted ratings
        const usersQuery = `
            SELECT
                u.id AS user_id,
                u.name,
                u.email,
                u.address,
                r.rating,
                r.updated_at AS submitted_at

            FROM ratings r

            INNER JOIN stores s
                ON r.store_id = s.id

            INNER JOIN users u
                ON r.user_id = u.id

            WHERE s.owner_id = $1

            ORDER BY r.updated_at DESC;
        `;

        const storeResult = await db.query(avgQuery, [ownerId]);
        const usersResult = await db.query(usersQuery, [ownerId]);

        return {
            store: storeResult.rows[0] || null,
            ratings: usersResult.rows
        };
    }
}

export default RatingModel;