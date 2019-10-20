/**
 * @flow
 * @relayHash 6d8e17339f3be7cbc0bfd07c8b689113
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteRequest } from 'relay-runtime';
export type Statement = {|
  area?: ?string,
  comment?: ?string,
|};
export type DisordersWithScoresQueryVariables = {|
  statements?: ?$ReadOnlyArray<?Statement>
|};
export type DisordersWithScoresQueryResponse = {|
  +matchDisorders: ?$ReadOnlyArray<?{|
    +disorder: ?{|
      +orphaNumber: ?string,
      +name: ?string,
      +description: ?string,
    |},
    +score: ?number,
  |}>
|};
export type DisordersWithScoresQuery = {|
  variables: DisordersWithScoresQueryVariables,
  response: DisordersWithScoresQueryResponse,
|};
*/


/*
query DisordersWithScoresQuery(
  $statements: [Statement]
) {
  matchDisorders(statements: $statements) {
    disorder {
      orphaNumber
      name
      description
    }
    score
  }
}
*/

const node/*: ConcreteRequest*/ = (function(){
var v0 = [
  {
    "kind": "LocalArgument",
    "name": "statements",
    "type": "[Statement]",
    "defaultValue": null
  }
],
v1 = [
  {
    "kind": "LinkedField",
    "alias": null,
    "name": "matchDisorders",
    "storageKey": null,
    "args": [
      {
        "kind": "Variable",
        "name": "statements",
        "variableName": "statements"
      }
    ],
    "concreteType": "DisorderWithScore",
    "plural": true,
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "disorder",
        "storageKey": null,
        "args": null,
        "concreteType": "Disorder",
        "plural": false,
        "selections": [
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "orphaNumber",
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
      },
      {
        "kind": "ScalarField",
        "alias": null,
        "name": "score",
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
    "name": "DisordersWithScoresQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": (v0/*: any*/),
    "selections": (v1/*: any*/)
  },
  "operation": {
    "kind": "Operation",
    "name": "DisordersWithScoresQuery",
    "argumentDefinitions": (v0/*: any*/),
    "selections": (v1/*: any*/)
  },
  "params": {
    "operationKind": "query",
    "name": "DisordersWithScoresQuery",
    "id": null,
    "text": "query DisordersWithScoresQuery(\n  $statements: [Statement]\n) {\n  matchDisorders(statements: $statements) {\n    disorder {\n      orphaNumber\n      name\n      description\n    }\n    score\n  }\n}\n",
    "metadata": {}
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = '708dddf1c71cae12dd4c2d32216db923';
module.exports = node;
