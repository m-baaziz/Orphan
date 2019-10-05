const _ = require('lodash');
const fs = require('fs');
const xml2js = require('xml2js');
const path = require('path');
const util = require('util');
const async = require('async');
const MongoClient = require('mongodb').MongoClient;

const Disorder = require('./models/Disorder');

const config = require('../config');

const { DB_HOST, DB_PORT, DB_NAME, DISORDERS_CLASSIFICATION_COLLECTION } = config;

const parser = new xml2js.Parser();
const readFile = util.promisify(fs.readFile);
const parseString = util.promisify(parser.parseString);
const directory = path.join(__dirname, '../data/git_orphadata/Orphanet classifications');
const url = `mongodb://${DB_HOST}:${DB_PORT}`;


async function main() {
  try {
    const filenames = fs.readdirSync(directory).map(filename => path.join(directory, filename));
    await async.eachSeries(filenames, processFile);
    console.log(`successfully parsed ${filenames.length} files`);
  } catch(e) {
    console.log('ERROR: ', e);
  }
}

async function processFile(filename) {
  try {
    console.log('reading xml file ', filename);
    const content = await readFile(filename);
    console.log('parsing xml file ...');
    const result = await parseString(content);
    console.log('Xml successfully parsed !');

    console.log('initalizing db connection ...');
    const client = await MongoClient.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    const collection = client.db(DB_NAME).collection(DISORDERS_CLASSIFICATION_COLLECTION);

    const processDisorder = async(disorderObj, directParents, parents) => {
      try {
        const orphaNumber = disorderObj.OrphaNumber[0];
        const expertLink = disorderObj.ExpertLink[0]._;
        console.log(`processing disorder ${orphaNumber} ...`);
        const disorder = new Disorder(orphaNumber);
        await disorder.fetch();
        const { name, description, synonyms } = disorder;
        let newDirectParents = [...directParents];
        let newParents = [...parents];
        const oldNode = await collection.findOne({ orphaNumber });
        if (oldNode) {
          newDirectParents = _.union(newDirectParents, oldNode.directParents);
          newParents = _.union(newParents, oldNode.newParents);
        }
        console.log(`saving disorder ${orphaNumber} ...`);
        await collection.updateOne({ orphaNumber }, {
          $set: {
            orphaNumber,
            name,
            description,
            expertLink,
            synonyms,
            directParents: newDirectParents,
            parents: newParents
          }
        }, {
          upsert: true
        });
        console.log(`successfully processed disorder ${orphaNumber}`);
        return Promise.resolve(disorder);
      } catch(e) {
        return Promise.reject(e);
      }
    }

    const processNode = async(node, directParents, parents) => {
      try {
        const { orphaNumber } = await processDisorder(node.Disorder[0], directParents, parents);
        const children = node.ClassificationNodeChildList[0].ClassificationNode || [];
        await async.eachSeries(children, async(child) => processNode(child, [orphaNumber], [...parents, orphaNumber]));
        return Promise.resolve();
      } catch(e) {
        return Promise.reject(e);
      }
    }

    console.log('processing root disorder ...');
    const rootDisorderObj = result.JDBOR.DisorderList[0].Disorder[0]
    const rootDisorder = await processDisorder(rootDisorderObj, [], []);

    const children = (
      rootDisorderObj.ClassificationNodeList && 
      rootDisorderObj.ClassificationNodeList[0].ClassificationNode &&
      rootDisorderObj.ClassificationNodeList[0].ClassificationNode[0].ClassificationNodeChildList &&
      rootDisorderObj.ClassificationNodeList[0].ClassificationNode[0].ClassificationNodeChildList[0].ClassificationNode
    ) ? rootDisorderObj.ClassificationNodeList[0].ClassificationNode[0].ClassificationNodeChildList[0].ClassificationNode : [];
    await async.eachSeries(children, async(child) => processNode(child, [rootDisorder.orphaNumber], [rootDisorder.orphaNumber]));

    console.log(`successfully inserted all disorders from ${filename}`);
    return Promise.resolve();
  } catch(e) {
    return Promise.reject(e);
  }
}


function associationToPhenotype(association) {
  return {
    'HPOId': association.HPO[0].HPOId[0],
    'name': association.HPO[0].HPOTerm[0],
    'frequency': association.HPOFrequency[0].Name[0]._
  }
}

main().then(() => {
  process.exit(1);
}).catch(e => {
  process.exit(0)
});
