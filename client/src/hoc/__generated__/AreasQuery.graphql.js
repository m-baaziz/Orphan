/**
 * @flow
 * @relayHash b2e1681e48303c61d78fefe71a1d5c8b
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteRequest } from 'relay-runtime';
export type AreasQueryVariables = {||};
export type AreasQueryResponse = {|
  +parentPhenotypes: ?$ReadOnlyArray<?{|
    +HPOId: ?string,
    +name: ?string,
    +description: ?string,
  |}>
|};
export type AreasQuery = {|
  variables: AreasQueryVariables,
  response: AreasQueryResponse,
|};
*/


/*
query AreasQuery {
  parentPhenotypes {
    HPOId
    name
    description
  }
}
*/

const node/*: ConcreteRequest*/ = (function(){
var v0 = [
  {
    "kind": "LinkedField",
    "alias": null,
    "name": "parentPhenotypes",
    "storageKey": null,
    "args": null,
    "concreteType": "Phenotype",
    "plural": true,
    "selections": [
      {
        "kind": "ScalarField",
        "alias": null,
        "name": "HPOId",
        "args": null,
        "storageKey": null
      },
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
];
return {
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
    "name": "AreasQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": [],
    "selections": (v0/*: any*/)
  },
  "operation": {
    "kind": "Operation",
    "name": "AreasQuery",
    "argumentDefinitions": [],
    "selections": (v0/*: any*/)
  },
  "params": {
    "operationKind": "query",
    "name": "AreasQuery",
    "id": null,
    "text": "query AreasQuery {\n  parentPhenotypes {\n    HPOId\n    name\n    description\n  }\n}\n",
    "metadata": {}
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = 'b7adb0192f0cf4c39501ad0b4ef0293a';
module.exports = node;
