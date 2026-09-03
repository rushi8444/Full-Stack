import db  from "../config/database.js";

class UserModel {

    // Create new user
    static async create({
        name,
        email,
        password,
        address,
        role = "Normal User"
    }) {
        const query = `
            INSERT INTO users (
                name,
                email,
                password,
                address,
                role
            )
            VALUES ($1, $2, $3, $4, $5)
            RETURNING
                id,
                name,
                email,
                address,
                role,
                created_at;
        `;

        const { rows } = await db.query(query, [
            name,
            email,
            password,
            address,
            role
        ]);

        return rows[0];
    }


    // Find user by email
    static async findByEmail(email) {
        const query = `
            SELECT *
            FROM users
            WHERE email = $1;
        `;

        const { rows } = await db.query(query, [email]);

        return rows[0];
    }


    // Find user by ID
    static async findById(id) {
        const query = `
            SELECT
                id,
                name,
                email,
                address,
                role,
                created_at
            FROM users
            WHERE id = $1;
        `;

        const { rows } = await db.query(query, [id]);

        return rows[0];
    }

    // Find a user with the password hash for credential checks
    static async findByIdWithPassword(id) {
        const query = `
            SELECT
                id,
                name,
                email,
                password,
                address,
                role,
                created_at
            FROM users
            WHERE id = $1;
        `;

        const { rows } = await db.query(query, [id]);

        return rows[0];
    }


    // Update password
    static async updatePassword(userId, hashedPassword) {
        const query = `
            UPDATE users
            SET
                password = $1,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = $2
            RETURNING
                id,
                name,
                email,
                role;
        `;

        const { rows } = await db.query(query, [
            hashedPassword,
            userId
        ]);

        return rows[0];
    }


    // Get all users with search, role filter and sorting
    static async findAll({
        search = "",
        role = "",
        sortBy = "name",
        sortOrder = "ASC"
    }) {

        const validSortFields = [
            "name",
            "email",
            "address",
            "role",
            "created_at"
        ];

        const orderBy = validSortFields.includes(sortBy)
            ? `u.${sortBy}`
            : "u.name";

        const direction =
            sortOrder.toUpperCase() === "DESC"
                ? "DESC"
                : "ASC";

        const query = `
            SELECT
                u.id,
                u.name,
                u.email,
                u.address,
                u.role,
                AVG(r.rating)::NUMERIC(3, 2) AS rating
            FROM users u
            LEFT JOIN stores s
                ON u.id = s.owner_id
            LEFT JOIN ratings r
                ON s.id = r.store_id
            WHERE (
                u.name ILIKE $1
                OR u.email ILIKE $1
                OR u.address ILIKE $1
            )
            AND ($2 = '' OR u.role = $2)
            GROUP BY u.id
            ORDER BY ${orderBy} ${direction};
        `;

        const { rows } = await db.query(query, [
            `%${search}%`,
            role
        ]);

        return rows;
    }
}

export default UserModel;