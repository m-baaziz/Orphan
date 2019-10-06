const fs = require('fs');
const xml2js = require('xml2js');
const path = require('path');
const util = require('util');
const async = require('async');
const config = require('config');
const { MongoClient } = require('mongodb');

const Disorder = require('./models/Disorder');

const {
  host: DB_HOST,
  port: DB_PORT,
  db: DB_NAME,
  collections: { disorders: DISORDERS_COLLECTION }
} = config.get('database');

const parser = new xml2js.Parser();
const readFile = util.promisify(fs.readFile);
const parseString = util.promisify(parser.parseString);
const filename = path.join(
  __dirname,
  '../data/git_orphadata/Phenotypes associated with rare disorders/en_product4_HPO.xml'
);
const url = `mongodb://${DB_HOST}:${DB_PORT}`;

function associationToPhenotype(association) {
  return {
    HPOId: association.HPO[0].HPOId[0],
    name: association.HPO[0].HPOTerm[0],
    frequency: association.HPOFrequency[0].Name[0]._
  };
}

async function main() {
  try {
    console.log('reading xml file ...');
    const content = await readFile(filename);
    console.log('parsing xml file ...');
    const result = await parseString(content);
    console.log('Xml successfully parsed !');

    const disorderList = result.JDBOR.DisorderList[0].Disorder;
    const disorders = disorderList.map(disorder => {
      const disorderAssociations = disorder.HPODisorderAssociationList[0].HPODisorderAssociation;
      const phenotypes = disorderAssociations.map(associationToPhenotype);
      const orphaNumber = disorder.OrphaNumber[0];

      return new Disorder(orphaNumber, phenotypes);
    });

    console.log(`start fetching ${disorders.length} disorders`);
    await async.eachSeries(disorders, async disorder => disorder.fetch());

    console.log('initalizing db connection ...');
    const client = await MongoClient.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    const collection = client.db(DB_NAME).collection(DISORDERS_COLLECTION);
    console.log(`inserting ${disorders.length} documents ...`);
    await collection.insertMany(disorders, {
      upsert: true
    });
    console.log(`successfully inserted ${disorders.length} documents`);
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
