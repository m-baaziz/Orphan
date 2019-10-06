const config = require('config');
const { MongoClient } = require('mongodb');

const {
  host: DB_HOST,
  port: DB_PORT,
  db: DB_NAME,
  collections: {
    phenotypes: PHENOTYPES_COLLECTION,
    phenotypes_classification: PHENOTYPES_CLASSIFICATION_COLLECTION,
    disorders: DISORDERS_COLLECTION,
    disorders_classification: DISORDERS_CLASSIFICATION_COLLECTION
  }
} = config.get('database');

const url = `mongodb://${DB_HOST}:${DB_PORT}`;

const indexes = {
  [DISORDERS_COLLECTION]: [
    {
      key: { orphaNumber: 1 },
      unique: true
    },
    {
      key: { 'phenotypes.HPOId': 1 }
    }
  ],
  [PHENOTYPES_COLLECTION]: [
    {
      key: { HPOId: 1 },
      unique: true
    },
    {
      key: { name: 1 }
    },
    {
      key: { description: 1 }
    },
    {
      key: { parents: 1 }
    }
  ],
  [PHENOTYPES_CLASSIFICATION_COLLECTION]: [
    {
      key: { HPOId: 1 },
      unique: true
    },
    {
      key: { parents: 1 }
    }
  ],
  [DISORDERS_CLASSIFICATION_COLLECTION]: [
    {
      key: { orphaNumber: 1 },
      unique: true
    },
    {
      key: { expertLink: 1 }
    }
  ]
};

async function main() {
  try {
    console.log('initalizing db connection ...');
    const client = await MongoClient.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    const collections = Object.keys(indexes);

    await Promise.all(
      collections.map(async collectionName => {
        console.log('creating index for collection ', collectionName);
        const collection = client.db(DB_NAME).collection(collectionName);
        return collection.createIndexes(indexes[collectionName]);
      })
    );

    console.log('indexes successfully created');
  } catch (e) {
    console.log('setup ERROR : ', e);
  }
}

main()
  .then(() => {
    process.exit(1);
  })
  .catch(() => {
    process.exit(0);
  });
