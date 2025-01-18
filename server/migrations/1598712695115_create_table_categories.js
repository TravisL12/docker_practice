module.exports = {
  up: `CREATE TABLE categories (
        id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(200) NOT NULL UNIQUE,
        parent_category_id INT,
        FOREIGN KEY (parent_category_id)
            REFERENCES categories(id),
        createdAt DATE,
        updatedAt DATE
    )`,
  down: "DROP TABLE categories",
};
