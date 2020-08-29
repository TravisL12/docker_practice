module.exports = {
  up: `INSERT INTO users(name) VALUES('Travis'),('Connor'),('Harper')`,
  down: "SELECT * from users",
};
