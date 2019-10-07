import React from 'react';
import PropTypes from 'prop-types';
import { createFragmentContainer } from 'react-relay';
import graphql from 'babel-plugin-relay/macro';

function Phenotype(props) {
  const { phenotype: { HPOId, name, description } } = props;

  return (
    <div key={HPOId + name}>
      {HPOId} - {name}: {description}
    </div>
  );
}

Phenotype.propTypes = {
  phenotype: PropTypes.shape({
    HPOId: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
  }).isRequired,
};

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
