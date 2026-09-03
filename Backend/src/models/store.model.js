import db from "../config/db.js";

class StoreModel {
    // Admin: Create a new store
    static async create({
        name,
        email,
        address,
        ownerId = null
    }) {
        const query = `
            INSERT INTO stores (
                name,
                email,
                address,
                owner_id
            )
            VALUES ($1, $2, $3, $4)
            RETURNING
                id,
                name,
                email,
                address,
                owner_id,
                created_at;
        `;

        const { rows } = await db.query(query, [
            name,
            email,
            address,
            ownerId
        ]);

        return rows[0];
    }

    // Normal User / Admin:
    // Fetch all stores with overall rating and current user's rating
    static async findAll({
        search = "",
        userId = null,
        sortBy = "name",
        sortOrder = "ASC"
    }) {
        const validSortFields = [
            "name",
            "email",
            "address",
            "created_at"
        ];

        // Allowlist prevents SQL injection in ORDER BY
        const orderBy = validSortFields.includes(sortBy)
            ? `s.${sortBy}`
            : "s.name";

        const direction =
            sortOrder.toUpperCase() === "DESC"
                ? "DESC"
                : "ASC";

        const query = `
            SELECT
                s.id,
                s.name,
                s.email,
                s.address,
                s.owner_id,
                COALESCE(
                    AVG(r.rating),
                    0
                )::NUMERIC(3, 2) AS overall_rating,
                user_r.rating AS user_submitted_rating
            FROM stores s

            LEFT JOIN ratings r
                ON s.id = r.store_id

            LEFT JOIN ratings user_r
                ON s.id = user_r.store_id
                AND user_r.user_id = $2

            WHERE
                s.name ILIKE $1
                OR s.address ILIKE $1

            GROUP BY
                s.id,
                user_r.rating

            ORDER BY ${orderBy} ${direction};
        `;

        const { rows } = await db.query(query, [
            `%${search}%`,
            userId
        ]);

        return rows;
    }

    // Get a single store by ID
    static async findById(id) {
        const query = `
            SELECT
                s.id,
                s.name,
                s.email,
                s.address,
                s.owner_id,
                s.created_at,
                COALESCE(
                    AVG(r.rating),
                    0
                )::NUMERIC(3, 2) AS overall_rating
            FROM stores s

            LEFT JOIN ratings r
                ON s.id = r.store_id

            WHERE s.id = $1

            GROUP BY s.id;
        `;

        const { rows } = await db.query(query, [id]);

        return rows[0];
    }
}

export default StoreModel;