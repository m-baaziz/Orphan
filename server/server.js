const express = require('express');

const { SERVER_PORT } = process.env;

const app = express();

app.get('/', (req, res) => {
  res.send('OHAYO GOSAYMASU !');
})

app.listen(SERVER_PORT);
