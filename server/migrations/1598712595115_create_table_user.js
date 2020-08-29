module.exports = {
  up: `CREATE TABLE user (
        id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
        name TEXT
    )`,
  down: "DROP TABLE user",
};
