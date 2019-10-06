const createError = require('http-errors');

const Db = require('../lib/Db');

async function findParentPhenotypes() {
  try {
    const phenotypes = await Db.phenotypesClassification
      .find({ directParents: 'HP:0000118' })
      .toArray();
    return phenotypes;
  } catch (e) {
    console.log('Error while fetching main phenotypes: ', e);
    return createError(500, 'Error while fetching main phenotypes');
  }
}

module.exports = {
  ParentPhenotypes: findParentPhenotypes
};
