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

    FOREIGN KEY (user_id)

        REFERENCES users(user_id)

        ON DELETE CASCADE

);

--------------------------------------------------
-- REVIEWS
--------------------------------------------------

CREATE TABLE reviews (

    review_id SERIAL PRIMARY KEY,

    user_id INTEGER NOT NULL,

    amiibo_head VARCHAR(8) NOT NULL,

    amiibo_tail VARCHAR(8) NOT NULL,

    rating INTEGER CHECK (

        rating >= 1

        AND rating <= 5

    ),

    review TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id)

        REFERENCES users(user_id)

        ON DELETE CASCADE

);

--------------------------------------------------
-- REQUESTS
--------------------------------------------------

CREATE TABLE requests (

    request_id SERIAL PRIMARY KEY,

    user_id INTEGER NOT NULL,

    subject VARCHAR(100) NOT NULL,

    message TEXT NOT NULL,

    status VARCHAR(25)

        DEFAULT 'Submitted',

    created_at TIMESTAMP

        DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id)

        REFERENCES users(user_id)

        ON DELETE CASCADE

);