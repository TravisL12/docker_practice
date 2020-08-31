const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mysql = require("node-mysql-helper");
const transactionController = require("./controllers/transactions");
const { asyncForEach } = require("./utilities/helpers");
const app = express();

app.use(cors());
app.use(bodyParser.json());

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

app.get("/", async (req, res) => {
  try {
    const likeQuery = req.query.likeQuery
      ? `description like '%${req.query.likeQuery}%' and`
      : "";
    const data = await mysql.query(
      `select description, date, amount from transactions WHERE ${likeQuery} date BETWEEN CURDATE() - INTERVAL 365 DAY AND CURDATE() order by date`
    );
    res.send({ data });
  } catch (error) {
    console.log(error);
  }
});

app.post("/seed", async (req, res) => {
  try {
    await asyncForEach(mysql, req.body, transactionController.add);
    res.send({ data: "Inserting" });
  } catch (error) {
    console.log(error);
  }
});

app.listen(PORT);
console.log(`Running on http://${HOST}:${PORT}`);
