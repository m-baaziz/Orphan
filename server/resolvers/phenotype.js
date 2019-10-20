const createError = require('http-errors');

const { findPhenotypesByDirectParent } = require('../lib/phenotype');

async function parentPhenotypes() {
  try {
    return await findPhenotypesByDirectParent('HP:0000118');
  } catch (e) {
    console.log('Error while fetching main phenotypes: ', e);
    return createError(500, 'Error while fetching main phenotypes');
  }
}

module.exports = {
  parentPhenotypes
};
