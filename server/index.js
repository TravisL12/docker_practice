const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mysql = require("node-mysql-helper");
const transactionController = require("./controllers/transactions");
const app = express();
const { asyncForEach } = require("./utilities/helpers");
const { TRANSACTION_QUERY } = require("./utilities/constants");

app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.NODE_PORT;
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

app.get("/spending", async (req, res) => {
  try {
    const likeQuery = req.query.likeQuery
      ? `and description like '%${req.query.likeQuery}%' `
      : "";

    const data = await mysql.query(
      `${TRANSACTION_QUERY} ${likeQuery}
      ORDER BY
        date desc
      LIMIT
        20000`
    );
    res.send({ data });
  } catch (error) {
    console.log(error);
  }
});

app.get("/monthly", async (req, res) => {
  const monthCount = 20;
  try {
    const likeQuery = req.query.likeQuery
      ? `and description like '%${req.query.likeQuery}%' `
      : "";

    const data = await mysql.query(`
      SELECT DATE_FORMAT(date, "%Y-%m") AS Month, SUM(amount) as sum
      FROM transactions
      ${likeQuery}
      GROUP BY DATE_FORMAT(date, "%Y-%m") 
      order by Month desc
      limit ${monthCount}
  `);

    res.send({ data });
  } catch (error) {
    console.log(error);
  }
});

app.post("/spending/add", async (req, res) => {
  try {
    const data = await asyncForEach(mysql, req.body, transactionController.add);
    res.send({ data });
  } catch (error) {
    console.log(error);
  }
});

app.listen(PORT);
console.log(`Running on http://${HOST}:${PORT}`);
