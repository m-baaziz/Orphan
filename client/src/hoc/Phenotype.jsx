/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { createFragmentContainer } from 'react-relay';
import graphql from 'babel-plugin-relay/macro';

function Phenotype(props) {
  const { phenotype: { HPOId, name, description }, render: RenderComponent, renderProps } = props;

  return <RenderComponent HPOId={HPOId} name={name} description={description} {...renderProps} />;
}

export default createFragmentContainer(
  Phenotype,
  {
    phenotype: graphql`
      fragment Phenotype_phenotype on Phenotype {
        HPOId
        name
        description
      }
    `,
  },
);
