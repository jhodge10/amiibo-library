DROP TABLE IF EXISTS request_history CASCADE;
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS user_amiibos CASCADE;
DROP TABLE IF EXISTS requests CASCADE;
DROP TABLE IF EXISTS users CASCADE;

--------------------------------------------------
-- USERS
--------------------------------------------------

CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

--------------------------------------------------
-- USER AMIIBOS
--------------------------------------------------

CREATE TABLE user_amiibos (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    amiibo_head VARCHAR(8) NOT NULL,
    amiibo_tail VARCHAR(8) NOT NULL,
    in_collection BOOLEAN DEFAULT FALSE,
    in_wishlist BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_user_amiibos_user
        FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE,

    CONSTRAINT unique_user_amiibo
        UNIQUE (user_id, amiibo_head, amiibo_tail)
);

--------------------------------------------------
-- REVIEWS
--------------------------------------------------

CREATE TABLE reviews (
    review_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    amiibo_head VARCHAR(8) NOT NULL,
    amiibo_tail VARCHAR(8) NOT NULL,
    rating INTEGER NOT NULL
        CHECK (rating >= 1 AND rating <= 5),
    review TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_reviews_user
        FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE,

    CONSTRAINT unique_user_review
        UNIQUE (user_id, amiibo_head, amiibo_tail)
);

--------------------------------------------------
-- REQUESTS
--------------------------------------------------

CREATE TABLE requests (
    request_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    subject VARCHAR(100) NOT NULL,
    message TEXT NOT NULL,
    status VARCHAR(25) NOT NULL DEFAULT 'Submitted',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_requests_user
        FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE
);

--------------------------------------------------
-- REQUEST HISTORY
--------------------------------------------------

CREATE TABLE request_history (
    history_id SERIAL PRIMARY KEY,
    request_id INTEGER NOT NULL,
    status VARCHAR(25) NOT NULL,
    changed_by INTEGER,
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_request_history_request
        FOREIGN KEY (request_id)
        REFERENCES requests(request_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_request_history_user
        FOREIGN KEY (changed_by)
        REFERENCES users(user_id)
        ON DELETE SET NULL
);