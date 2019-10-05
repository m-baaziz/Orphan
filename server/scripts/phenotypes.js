const request = require('request');
const async = require('async');
const MongoClient = require('mongodb').MongoClient;

const Phenotype = require('./models/Phenotype');

const config = require('../config');
const { DB_HOST, DB_PORT, DB_NAME, DISORDERS_COLLECTION, PHENOTYPES_COLLECTION } = config;

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
    await async.eachSeries(disorders, async(disorder) => {
      try {
        console.log(`creating ${disorder.phenotypes.length} phenotypes ...`);
        const phenotypes = await async.mapSeries(disorder.phenotypes, async({ HPOId }) => {
          try {
            const phenotype = new Phenotype(HPOId);
            await phenotype.fetch();
            return Promise.resolve(phenotype);
          } catch(e) {
            return Promise.reject(e);
          }
        });
        console.log(`saving ${phenotypes.length} phenotypes ...`);
        try {
          await phenotypesCollection.insertMany(phenotypes, {
            ordered: false
          });
        } catch(mongoError) {
          // if not simple duplicate error
          if (mongoError.code !== 11000) {
            return Promise.reject(mongoError);
          }
        }
        console.log(`successfully saved ${disorder.phenotypes.length} phenotypes ...`);
        return Promise.resolve();
      } catch(e) {
        return Promise.reject(e);
      }
    });
    console.log('successfully saved all phenotypes')
  } catch(e) {
    console.log('ERROR: ', e);
  }
}



main().then(() => {
  process.exit(1);
}).catch(e => {
  process.exit(0)
});
