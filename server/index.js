const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mysql = require("node-mysql-helper");
const transactionController = require("./controllers/transactions");
const app = express();
const { asyncForEach } = require("./utilities/helpers");

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

app.get("/", async (req, res) => {
  try {
    const likeQuery = req.query.likeQuery
      ? `WHERE description like '%${req.query.likeQuery}%' `
      : "";

    const data = await mysql.query(
      `SELECT 
        description, date, amount from transactions    
      ${likeQuery}
      ORDER BY
        date desc
      LIMIT
        1000`
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

    // category 89 === outgoing transfers
    const data = await mysql.query(`
      SELECT DATE_FORMAT(date, "%Y-%m") AS Month, SUM(amount) as sum
      FROM transactions
      where category_id != 89 ${likeQuery}
      GROUP BY DATE_FORMAT(date, "%Y-%m") 
      order by Month desc
      limit ${monthCount}
  `);

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
