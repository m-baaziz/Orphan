const express = require('express');

const { SERVER_PORT } = process.env;

const app = express();
const api = express.Router();

app.use('/api', api);

api.get('/areas', (req, res) => {
  console.log('in get !');
  res.send('OHAYO GOSAYMASU !');
})

app.listen(SERVER_PORT);
