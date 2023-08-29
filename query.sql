-- Active: 1692600013165@@localhost@5432@db_batch14

SELECT * FROM users 

INSERT INTO
    users(
        id,
        username,
        password,
        email,
        phone_number
    )
VALUES (
        4,
        'bambang',
        '015',
        'bambang1@gmail.com',
        '0545'
    )

CREATE TABLE
    category (
        id SERIAL PRIMARY KEY,
        name VARCHAR NOT NULL
    )

SELECT *FROM category 

CREATE TABLE
    food_recipes (
        id SERIAL PRIMARY KEY,
        name_recipes VARCHAR(255) NOT NULL,
        image_recipes VARCHAR(255) NOT NULL,
        ingredients VARCHAR(255) NOT NULL,
        users_id INT NOT NULL,
        category_id INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (users_id) REFERENCES users (id),
        FOREIGN KEY(category_id) REFERENCES category (id)
    )

SELECT *FROM food_recipes 

INSERT INTO
    food_recipes(
        name_recipes,
        image_recipes,
        ingredients,
        users_id,
        category_id,
        created_at,
        deleted_at
    )
VALUES (
        'ayam goreng',
        'url ayam goreng',
        'ayam+tepung',
        2,
        2,
        current_timestamp,
        NULL
    )

ALTER TABLE food_recipes add deleted_at TIMESTAMP DEFAULT NULL;

ALTER TABLE food_recipes add description VARCHAR(255) 

INSERT INTO
    food_recipes(
        name_recipes,
        image_recipes,
        ingredients,
        users_id,
        category_id,
        created_at,
        deleted_at,
        description
    )
VALUES (
        'ayam bakar',
        'url ayam tes',
        'ayam+tepung',
        3,
        2,
        'ada apa ini',
        CURRENT_TIMESTAMP,
        NULL
    )

ALTER TABLE users
add
    profile_picture VARCHAR(255) NULL,
add role VARCHAR(255) NULL

ALTER TABLE users add role INTEGER 