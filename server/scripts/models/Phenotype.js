const request = require('request');
const _ = require('lodash');

const config = require('config');

const HPO_URL = config.get('sparql').hpo;

module.exports = class Phenotype {
  static fromDb({ HPOId, name, description, parents, directParents }) {
    const phenotype = new Phenotype(HPOId, name, description);
    phenotype.directParents = directParents;
    phenotype.parents = parents;
    return phenotype;
  }

  constructor(HPOId, name = '', description = '', parents = []) {
    this.HPOId = HPOId;
    this.name = name;
    this.description = description;
    this.parents = parents;
    this.directParents = parents;
  }

  addParents(parents) {
    this.parents = _.uniq(_.flattenDeep([...this.parents, ...parents]));
  }

  set immediateParents(directParents) {
    this.directParents = directParents;
    this.addParents(directParents);
  }

  fetch() {
    const id = this.HPOId.replace(':', '_');
    const query = `
      PREFIX obo: <http://purl.obolibrary.org/obo/>

      select ?label ?parent ?description
      where {
        <http://purl.obolibrary.org/obo/${id}> rdfs:subClassOf ?parent .
        <http://purl.obolibrary.org/obo/${id}> rdfs:label ?label .
        OPTIONAL { <http://purl.obolibrary.org/obo/${id}> obo:IAO_0000115 ?description }
      }
    `;
    return new Promise((resolve, reject) => {
      console.log(`fetching Phenotype ${this.HPOId} ...`);
      request.post(
        {
          url: HPO_URL,
          headers: {
            Accept: 'application/sparql-results+json'
          },
          form: { query }
        },
        (err, response, body) => {
          if (err || response.statusCode !== 200) {
            console.log(HPO_URL, query);
            console.log('fetching error :: ', err, body, response.statusCode);
            reject(err || body);
            return;
          }
          console.log(`fetched Phenotype ${this.HPOId}`);
          const {
            results: { bindings }
          } = JSON.parse(body);

          if (bindings.length === 0) {
            resolve();
            return;
          }

          this.name = bindings[0].label.value;
          this.description = _.has(bindings[0], 'description.value')
            ? bindings[0].description.value
            : this.description;
          this.immediateParents = bindings.map(b => {
            const chunks = b.parent.value.split('/');
            return chunks[chunks.length - 1].replace('_', ':');
          });

          resolve();
        }
      );
    });
  }
};
