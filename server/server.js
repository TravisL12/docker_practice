const express = require('express');

const PORT = process.env.APP_PORT;
const HOST = '0.0.0.0';

const app = express();
app.get('/', (req, res) => {
  res.send('Hi Trav');
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
