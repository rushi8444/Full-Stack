-- =========================================================
-- DATABASE SCHEMA
-- Node.js + Express + PostgreSQL (pg)
-- =========================================================


-- =========================================================
-- 1. EXTENSIONS
-- =========================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";


-- =========================================================
-- 2. USERS TABLE
-- =========================================================

CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    name VARCHAR(60) NOT NULL,

    email VARCHAR(255) NOT NULL UNIQUE,

    password VARCHAR(255) NOT NULL,

    address VARCHAR(400) NOT NULL,

    role VARCHAR(30) NOT NULL DEFAULT 'Normal User',

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT users_role_check
        CHECK (
            role IN (
                'System Administrator',
                'Normal User',
                'Store Owner'
            )
        )
);


-- =========================================================
-- 3. STORES TABLE
-- =========================================================

CREATE TABLE IF NOT EXISTS stores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    name VARCHAR(255) NOT NULL,

    email VARCHAR(255) NOT NULL UNIQUE,

    address VARCHAR(400) NOT NULL,

    owner_id UUID NULL,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_store_owner
        FOREIGN KEY (owner_id)
        REFERENCES users(id)
        ON DELETE SET NULL
);


-- =========================================================
-- 4. RATINGS TABLE
-- =========================================================

CREATE TABLE IF NOT EXISTS ratings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    user_id UUID NOT NULL,

    store_id UUID NOT NULL,

    rating NUMERIC(2,1) NOT NULL,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_rating_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_rating_store
        FOREIGN KEY (store_id)
        REFERENCES stores(id)
        ON DELETE CASCADE,

    CONSTRAINT rating_range
        CHECK (rating >= 1 AND rating <= 5),

    CONSTRAINT unique_user_store_rating
        UNIQUE (user_id, store_id)
);


-- =========================================================
-- 5. INDEXES
-- =========================================================

CREATE INDEX IF NOT EXISTS idx_users_email
    ON users(email);

CREATE INDEX IF NOT EXISTS idx_users_role
    ON users(role);

CREATE INDEX IF NOT EXISTS idx_stores_owner_id
    ON stores(owner_id);

CREATE INDEX IF NOT EXISTS idx_stores_name
    ON stores(name);

CREATE INDEX IF NOT EXISTS idx_ratings_user_id
    ON ratings(user_id);

CREATE INDEX IF NOT EXISTS idx_ratings_store_id
    ON ratings(store_id);


-- =========================================================
-- 6. UPDATED_AT TRIGGER
-- =========================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE TRIGGER update_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();


CREATE OR REPLACE TRIGGER update_stores_updated_at
BEFORE UPDATE ON stores
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();


CREATE OR REPLACE TRIGGER update_ratings_updated_at
BEFORE UPDATE ON ratings
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();