const fs = require('fs');
const path = require('path');
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const config = require('config');
const { buildSchema } = require('graphql');
const graphqlHTTP = require('express-graphql');

const Db = require('./lib/Db');
const dev = require('./routes/dev');
const phenotypeResolvers = require('./resolvers/phenotype');
const disorderResolvers = require('./resolvers/disorder');

const { port: SERVER_PORT } = config.get('server');
const ENV = config.get('env');

const resolvers = {
  ...phenotypeResolvers,
  ...disorderResolvers
};
const graphqlSchema = buildSchema(fs.readFileSync(path.join(__dirname, 'schema.graphql'), 'utf8'));
const graphqlOptions = {
  schema: graphqlSchema,
  rootValue: resolvers,
  graphiql: true,
  customFormatErrorFn: ({ message, statusCode }) => ({
    message,
    statusCode
  })
};

const app = express();
app
  .use(
    bodyParser.urlencoded({
      extended: true
    })
  )
  .use(bodyParser.json())
  .use(morgan('combined'))
  .use(
    '/dev',
    ENV === 'dev'
      ? dev
      : (req, res) => {
          res.status(403).send('Unauthorized');
        }
  );

app.use('/graphql', graphqlHTTP(graphqlOptions));

async function init() {
  try {
    await Db.init();
    return Promise.resolve();
  } catch (e) {
    return Promise.reject(e);
  }
}

init()
  .then(() => {
    app.listen(SERVER_PORT);
  })
  .catch(e => {
    console.log('Error while initializing server: ', e);
    process.exit(0);
  });
