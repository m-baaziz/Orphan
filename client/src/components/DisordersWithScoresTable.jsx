import React from 'react';
import { withStyles } from '@material-ui/core/styles';

import DisordersWithScores from '../hoc/DisordersWithScores';
import Table from './Table';


const styles = () => ({});

function round(num, digits = 2) {
  return +num.toFixed(digits);
}

function DisordersWithScoresTable(props) {
  const { disordersWithScores } = props;
  return (
    <Table
      items={disordersWithScores || []}
      cols={{
        orphaNumber: ({ disorder: { orphaNumber } }) => orphaNumber,
        name: ({ disorder: { name } }) => name,
        description: ({ disorder: { description } }) => description,
        score: ({ score }) => round(score),
      }}
    />
  );
}

function ConnectedTable(props) {
  const { statements, classes } = props;
  return (
    <DisordersWithScores
      statements={statements}
      render={DisordersWithScoresTable}
      renderProps={{
        classes,
      }}
    />
  );
}

export default withStyles(styles)(ConnectedTable);
