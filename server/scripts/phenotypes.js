const async = require('async');
const config = require('config');
const { MongoClient } = require('mongodb');

const Phenotype = require('./models/Phenotype');

const {
  host: DB_HOST,
  port: DB_PORT,
  db: DB_NAME,
  collections: { disorders: DISORDERS_COLLECTION, phenotypes: PHENOTYPES_COLLECTION }
} = config.get('database');

const url = `mongodb://${DB_HOST}:${DB_PORT}`;

async function main() {
  try {
    console.log('initalizing db connection ...');
    const client = await MongoClient.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    const disordersCollection = client.db(DB_NAME).collection(DISORDERS_COLLECTION);
    const phenotypesCollection = client.db(DB_NAME).collection(PHENOTYPES_COLLECTION);

    const disorders = await disordersCollection.find().toArray();

    console.log(`processing ${disorders.length} disorders ...`);
    await async.eachSeries(disorders, async disorder => {
      try {
        console.log(`creating ${disorder.phenotypes.length} phenotypes ...`);
        const phenotypes = await async.mapSeries(disorder.phenotypes, async ({ HPOId }) => {
          try {
            const phenotype = new Phenotype(HPOId);
            await phenotype.fetch();
            return Promise.resolve(phenotype);
          } catch (e) {
            return Promise.reject(e);
          }
        });
        console.log(`saving ${phenotypes.length} phenotypes ...`);
        try {
          await phenotypesCollection.insertMany(phenotypes, {
            ordered: false
          });
        } catch (mongoError) {
          // if not simple duplicate error
          if (mongoError.code !== 11000) {
            return Promise.reject(mongoError);
          }
        }
        console.log(`successfully saved ${disorder.phenotypes.length} phenotypes ...`);
        return Promise.resolve();
      } catch (e) {
        return Promise.reject(e);
      }
    });
    console.log('successfully saved all phenotypes');
  } catch (e) {
    console.log('ERROR: ', e);
  }
}

main()
  .then(() => {
    process.exit(1);
  })
  .catch(() => {
    process.exit(0);
  });
