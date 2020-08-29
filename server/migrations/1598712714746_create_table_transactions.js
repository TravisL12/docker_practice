module.exports = {
  up: `CREATE TABLE transactions (
        id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
        description VARCHAR(255),
        amount INT,
        date DATE,
        category_id INT,
        sub_category_id INT,
        FOREIGN KEY (category_id)
            REFERENCES categories(id),
        FOREIGN KEY (sub_category_id) 
            REFERENCES categories(id),
        payee VARCHAR(255),
        user_id INT,
        FOREIGN KEY (user_id)
            REFERENCES users(id),
        createdAt DATE NOT NULL,
        updatedAt DATE NOT NULL
    )`,
  down: "DROP TABLE transactions",
};
