const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const config = require('config');

const Db = require('./lib/Db');

const { findParentPhenotypes } = require('./controllers/phenotypes');

const { port: SERVER_PORT } = config.get('server');

const app = express();
const api = express.Router();

app
  .use(
    bodyParser.urlencoded({
      extended: true
    })
  )
  .use(bodyParser.json())
  .use(morgan('combined'))
  .use('/api', api);

api.get('/areas', findParentPhenotypes);

Db.init()
  .then(() => {
    app.listen(SERVER_PORT);
  })
  .catch(e => {
    console.log('Error while initializing Db: ', e);
    process.exit(0);
  });
