import React from 'react';
import { QueryRenderer } from 'react-relay';
import graphql from 'babel-plugin-relay/macro';

import environment from '../api/environment';

import Phenotype from './Phenotype';

function ParentPhenotypes() {
  return (
    <QueryRenderer
      environment={environment}
      query={graphql`
          query ParentPhenotypesQuery {
            parentPhenotypes {
              HPOId
              ...Phenotype_phenotype
            }
          }
        `}
      variables={{}}
      render={(res) => {
        const { error, props: data } = res;
        if (error) {
          return <div>Error!</div>;
        }
        if (!data) {
          return <div>Loading...</div>;
        }

        return (
          <div>
            { data.parentPhenotypes.map((phenotype) => <Phenotype key={phenotype.HPOId} phenotype={phenotype} />) }
          </div>
        );
      }}
    />
  );
}

export default ParentPhenotypes;
