const express = require("express");
const cors = require("cors");
const mysql = require("node-mysql-helper");
const transactionController = require("./controllers/transactions");
const app = express();
app.use(cors());

const PORT = process.env.APP_PORT;
const HOST = "mysql-db";

const mysqlOptions = {
  host: `${HOST}`,
  port: "3306",
  user: "root",
  password: "password",
  database: "db",
  socketPath: false,
  connectionLimit: 5,
};

mysql.connect(mysqlOptions);

app.get("/", (req, res) => {
  res.send({ data: "Hi Trav" });
});

app.get("/seed", async (req, res) => {
  await transactionController.add(mysql);

  res.send({ data: "Inserting" });
});

app.listen(PORT);
console.log(`Running on http://${HOST}:${PORT}`);
