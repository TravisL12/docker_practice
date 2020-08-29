module.exports = {
  up: `CREATE TABLE category (
        id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(200),
        parent_category_id INT,
        FOREIGN KEY (parent_category_id)
            REFERENCES category(id),
        createdAt DATE NOT NULL,
        updatedAt DATE NOT NULL
    )`,
  down: "DROP TABLE category",
};
