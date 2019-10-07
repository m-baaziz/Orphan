/**
 * @flow
 * @relayHash bb16da6bfeb82fc86d56e53af348fe7e
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteRequest } from 'relay-runtime';
type Phenotype_phenotype$ref = any;
export type ParentPhenotypesQueryVariables = {||};
export type ParentPhenotypesQueryResponse = {|
  +parentPhenotypes: ?$ReadOnlyArray<?{|
    +HPOId: ?string,
    +$fragmentRefs: Phenotype_phenotype$ref,
  |}>
|};
export type ParentPhenotypesQuery = {|
  variables: ParentPhenotypesQueryVariables,
  response: ParentPhenotypesQueryResponse,
|};
*/


/*
query ParentPhenotypesQuery {
  parentPhenotypes {
    HPOId
    ...Phenotype_phenotype
  }
}

fragment Phenotype_phenotype on Phenotype {
  HPOId
  name
  description
}
*/

const node/*: ConcreteRequest*/ = (function(){
var v0 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "HPOId",
  "args": null,
  "storageKey": null
};
return {
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
    "name": "ParentPhenotypesQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": [],
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "parentPhenotypes",
        "storageKey": null,
        "args": null,
        "concreteType": "Phenotype",
        "plural": true,
        "selections": [
          (v0/*: any*/),
          {
            "kind": "FragmentSpread",
            "name": "Phenotype_phenotype",
            "args": null
          }
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "ParentPhenotypesQuery",
    "argumentDefinitions": [],
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "parentPhenotypes",
        "storageKey": null,
        "args": null,
        "concreteType": "Phenotype",
        "plural": true,
        "selections": [
          (v0/*: any*/),
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "name",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "description",
            "args": null,
            "storageKey": null
          }
        ]
      }
    ]
  },
  "params": {
    "operationKind": "query",
    "name": "ParentPhenotypesQuery",
    "id": null,
    "text": "query ParentPhenotypesQuery {\n  parentPhenotypes {\n    HPOId\n    ...Phenotype_phenotype\n  }\n}\n\nfragment Phenotype_phenotype on Phenotype {\n  HPOId\n  name\n  description\n}\n",
    "metadata": {}
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = 'c0c6df394cec5d5033a93af7cd761791';
module.exports = node;
