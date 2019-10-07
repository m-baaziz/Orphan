/**
 * @flow
 */

/* eslint-disable */

'use strict';

/*::
import type { ReaderFragment } from 'relay-runtime';
import type { FragmentReference } from "relay-runtime";
declare export opaque type Phenotype_phenotype$ref: FragmentReference;
declare export opaque type Phenotype_phenotype$fragmentType: Phenotype_phenotype$ref;
export type Phenotype_phenotype = {|
  +HPOId: ?string,
  +name: ?string,
  +description: ?string,
  +$refType: Phenotype_phenotype$ref,
|};
export type Phenotype_phenotype$data = Phenotype_phenotype;
export type Phenotype_phenotype$key = {
  +$data?: Phenotype_phenotype$data,
  +$fragmentRefs: Phenotype_phenotype$ref,
};
*/


const node/*: ReaderFragment*/ = {
  "kind": "Fragment",
  "name": "Phenotype_phenotype",
  "type": "Phenotype",
  "metadata": null,
  "argumentDefinitions": [],
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
};
// prettier-ignore
(node/*: any*/).hash = '96a9038f10880b597b3af7042dcb6416';
module.exports = node;
