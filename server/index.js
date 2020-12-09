const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('node-mysql-helper');
const transactionController = require('./controllers/transactions');
const app = express();
const { asyncForEach } = require('./utilities/helpers');

app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.NODE_PORT;
const HOST = 'mysql-db';

const mysqlOptions = {
  host: `${HOST}`,
  port: '3306',
  user: 'root',
  password: 'password',
  database: 'db',
  socketPath: false,
  connectionLimit: 5,
};

mysql.connect(mysqlOptions);

app.get('/spending', async (req, res) => {
  try {
    const likeQuery = req.query.likeQuery
      ? `and description like '%${req.query.likeQuery}%' `
      : '';

    const data = await mysql.query(
      `SELECT 
        t.description, t.payee, t.date, t.amount, cat.name category, subcat.name subcategory from transactions t
        left join categories cat on t.category_id = cat.id
        left join categories subcat on t.sub_category_id = subcat.id
      where description not like 'ONLINE TRANSFER TO%' ${likeQuery}
      ORDER BY
        date desc
      LIMIT
        5000`
    );
    res.send({ data });
  } catch (error) {
    console.log(error);
  }
});

app.get('/spending/date', async (req, res) => {
  try {
    const dateStart = '2012-03-11';
    const dateEnd = '2020-12-11';
    const dateRange = `and t.date between '${dateStart}' and '${dateEnd}' `;

    const data = await mysql.query(
      `SELECT 
        t.description, t.payee, t.date, t.amount, cat.name category, subcat.name subcategory from transactions t
        left join categories cat on t.category_id = cat.id
        left join categories subcat on t.sub_category_id = subcat.id
      where description not like 'ONLINE TRANSFER TO%' ${dateRange}
      ORDER BY
        date desc
      `
    );
    res.send({ data });
  } catch (error) {
    console.log(error);
  }
});

app.get('/monthly', async (req, res) => {
  const monthCount = 20;
  try {
    const likeQuery = req.query.likeQuery
      ? `and description like '%${req.query.likeQuery}%' `
      : '';

    // category 93 === outgoing transfers
    const data = await mysql.query(`
      SELECT DATE_FORMAT(date, "%Y-%m") AS Month, SUM(amount) as sum
      FROM transactions
      where category_id != 93 ${likeQuery}
      GROUP BY DATE_FORMAT(date, "%Y-%m") 
      order by Month desc
      limit ${monthCount}
  `);

    res.send({ data });
  } catch (error) {
    console.log(error);
  }
});

app.post('/spending/add', async (req, res) => {
  try {
    await asyncForEach(mysql, req.body, transactionController.add);
    res.send({ data: 'Inserting' });
  } catch (error) {
    console.log(error);
  }
});

app.listen(PORT);
console.log(`Running on http://${HOST}:${PORT}`);
