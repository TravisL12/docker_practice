const express = require('express');
const cors = require('cors');
const mysql = require('mysql');

const app = express();
app.use(cors());

const PORT = process.env.APP_PORT;
const HOST = 'mysql-db';
const connection = mysql.createConnection({
  host: `${HOST}`,
  port: '3306',
  user: 'root',
  password: 'password',
  database: 'db',
});

connection.connect(function (err) {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }

  console.log('connected as id ' + connection.threadId);
});

app.get('/', (req, res) => {
  res.send({ data: 'Hi Trav' });
});

app.listen(PORT);
console.log(`Running on http://${HOST}:${PORT}`);
