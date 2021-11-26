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
    const data = await mysql.query(
      `${TRANSACTION_QUERY}
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

app.get("/search", async (req, res) => {
  try {
    const data = await mysql.query(
      `${TRANSACTION_QUERY} and description like CONCAT('%',?,'%')
      ORDER BY
        date desc
      LIMIT
        20000`,
      req.query.likeQuery
    );

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
