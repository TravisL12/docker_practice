module.exports = {
  up: `CREATE TABLE transaction (
        id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
        description VARCHAR(255),
        amount INT,
        date DATE,
        category_id INT,
        sub_category_id INT,
        FOREIGN KEY (category_id)
            REFERENCES category(id),
        FOREIGN KEY (sub_category_id) 
            REFERENCES category(id),
        payee VARCHAR(255),
        user_id INT,
        FOREIGN KEY (user_id)
            REFERENCES user(id),
        createdAt DATE NOT NULL,
        updatedAt DATE NOT NULL
    )`,
  down: "DROP TABLE transaction",
};
