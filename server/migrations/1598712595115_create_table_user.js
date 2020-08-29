module.exports = {
  up: `CREATE TABLE users (
        id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
        name TEXT
    )`,
  down: "DROP TABLE users",
};
