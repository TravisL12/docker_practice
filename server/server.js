const express = require('express');
const cors = require('cors');

const PORT = process.env.APP_PORT;
const HOST = '0.0.0.0';

const app = express();
app.use(cors());

app.get('/', (req, res) => {
  res.send({ data: 'Hi Trav' });
});

app.listen(PORT);
console.log(`Running on http://${HOST}:${PORT}`);
