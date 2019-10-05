const request = require('request');
const _ = require('lodash');

const config = require('../../config');

const { ORDO_URL } = config;

module.exports = class Disorder {
  static fromDb({ orphaNumber, phenotypes, name, description, synonyms }) {
    return new Disorder(orphaNumber, phenotypes, name, description, synonyms);
  }

  constructor(orphaNumber, phenotypes, name = '', description = '', synonyms = '') {
    this.orphaNumber = orphaNumber;
    this.phenotypes = phenotypes;
    this.name = name;
    this.description = description;
    this.synonyms = synonyms;
  }

  fetch() {
    const query = `
      PREFIX efo: <http://www.ebi.ac.uk/efo/>

      select ?label ?description ?synonym
      where {
        <http://www.orpha.net/ORDO/Orphanet_${this.orphaNumber}> rdfs:label ?label .
        OPTIONAL { <http://www.orpha.net/ORDO/Orphanet_${this.orphaNumber}> efo:definition ?description } .
        OPTIONAL { <http://www.orpha.net/ORDO/Orphanet_${this.orphaNumber}> efo:alternative_term ?synonym }
      }
    `;
    return new Promise((resolve, reject) => {
      console.log(`fetching Disorder ${this.orphaNumber} ...`);
      request.post({
        url: ORDO_URL,
        headers: {
          'Accept': 'application/sparql-results+json'
        },
        form: { query }
      }, (err, response, body) => {
        if (err || response.statusCode !== 200) {
          console.log(ORDO_URL, query);
          console.log('fetching error :: ', err, body, response.statusCode);
          reject(err || body);
          return;
        }
        console.log(`fetched Disorder ${this.orphaNumber}`);
        const { results: { bindings } } = JSON.parse(body);
        console.log('body: ', body);
        if (bindings.length === 0) {
          console.log(`Disorder ${this.orphaNumber} not found in ontology: `, query);
          resolve();
          return;
        }
        const { label, description, synonyms } = bindings.reduce(
          (acc, { label, description, synonym }) => ({
            label: label.value,
            description: description ? description.value : '',
            synonyms: synonym ? [...acc.synonyms, synonym.value] : acc.synonyms
          }),
          { label: '', description: '', synonyms: [] }
        );

        this.name = label;
        this.description = description;
        this.synonyms = synonyms;

        resolve();
      });
    });
  }
}
