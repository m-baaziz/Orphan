const MongoClient = require('mongodb').MongoClient;

const config = require('./config');

const {
  DB_HOST,
  DB_PORT,
  DB_NAME,
  DISORDERS_COLLECTION,
  PHENOTYPES_CLASSIFICATION_COLLECTION,
  PHENOTYPES_COLLECTION,
  DISORDERS_CLASSIFICATION_COLLECTION
} = config;

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
      key: { 'name': 1 }
    },
    {
      key: { 'description': 1 }
    },
    {
      key: { 'parents': 1 }
    }
  ],
  [PHENOTYPES_CLASSIFICATION_COLLECTION]: [
    {
      key: { HPOId: 1 },
      unique: true
    },
    {
      key: { 'parents': 1 }
    }
  ],
  [DISORDERS_CLASSIFICATION_COLLECTION]: [
    {
      key: { orphaNumber: 1 },
      unique: true
    },
    {
      key: { 'expertLink': 1 }
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

    await Promise.all(collections.map(async(collectionName) => {
      console.log('creating index for collection ', collectionName);
      const collection = client.db(DB_NAME).collection(collectionName);
      return collection.createIndexes(indexes[collectionName]);
    }));

    console.log('indexes successfully created');
  } catch(e) {
    console.log('setup ERROR : ', e);
  }
  return;
}

main().then(() => {
  process.exit(1);
}).catch(e => {
  process.exit(0)
});
