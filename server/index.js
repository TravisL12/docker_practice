const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mysql = require("node-mysql-helper");
const transactionController = require("./controllers/transactions");
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

app.get("/", (req, res) => {
  res.send({ data: "Hi Trav" });
});

async function asyncForEach(array, callback) {
  for (let i = 0; i < array.length; i++) {
    await callback(mysql, array[i]);
  }
}

app.post("/seed", async (req, res) => {
  await asyncForEach(req.body, transactionController.add);
  res.send({ data: "Inserting" });
});

app.listen(PORT);
console.log(`Running on http://${HOST}:${PORT}`);
