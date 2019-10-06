/* eslint-disable no-await-in-loop */
const async = require('async');
const config = require('config');
const { MongoClient } = require('mongodb');

const Phenotype = require('./models/Phenotype');

const {
  host: DB_HOST,
  port: DB_PORT,
  db: DB_NAME,
  collections: {
    phenotypes: PHENOTYPES_COLLECTION,
    phenotypes_classification: PHENOTYPES_CLASSIFICATION_COLLECTION
  }
} = config.get('database');

const url = `mongodb://${DB_HOST}:${DB_PORT}`;

async function main() {
  try {
    console.log('initalizing db connection ...');
    const client = await MongoClient.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    const phenotypesCollection = client.db(DB_NAME).collection(PHENOTYPES_COLLECTION);
    const classificationsCollection = client
      .db(DB_NAME)
      .collection(PHENOTYPES_CLASSIFICATION_COLLECTION);

    const processParent = async (HPOId, parents) => {
      try {
        console.log(`processing parent ${HPOId}`);
        const phenotype = new Phenotype(HPOId);
        await phenotype.fetch();
        const { name, description, directParents } = phenotype;
        try {
          await classificationsCollection.insertOne({
            HPOId: phenotype.HPOId,
            name,
            description,
            directParents
          });
        } catch (mongoError) {
          // if not simple duplicate error
          if (mongoError.code !== 11000) {
            return Promise.reject(mongoError);
          }
        }
        console.log(`saved phenotype ${HPOId} in db`);
        if (directParents.length === 0) return Promise.resolve(parents);
        return Promise.all(
          directParents.map(parentHPOId => processParent(parentHPOId, [...parents, parentHPOId]))
        );
      } catch (e) {
        return Promise.reject(e);
      }
    };

    const phenotypesCursor = phenotypesCollection.find();
    let count = 0;

    while (await phenotypesCursor.hasNext()) {
      const phenotype = Phenotype.fromDb(await phenotypesCursor.next());
      if (phenotype === null) return;
      count += 1;
      const { HPOId, directParents } = phenotype;
      console.log(`processing phenotype ${HPOId}, count: ${count}`);
      await async.eachSeries(directParents, async parent => {
        try {
          const parents = await processParent(parent, []);
          phenotype.addParents(parents);
          return Promise.resolve();
        } catch (e) {
          return Promise.reject(e);
        }
      });
      console.log(`updating phenotype ${HPOId}'s parents`);
      await phenotypesCollection.updateOne(
        { HPOId },
        {
          $set: {
            parents: phenotype.parents
          }
        }
      );
    }

    console.log(`processed all ${count} phenotypes !`);
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
