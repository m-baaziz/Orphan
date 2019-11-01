import React from 'react';
import queryString from 'query-string';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';

import DisordersWithScoresTable from '../components/DisordersWithScoresTable';


const styles = () => ({
  root: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
  tableContainer: {
    padding: 50,
  },
});

function DisordersScores(props) {
  const { classes, location: { search } } = props;
  let { statements } = queryString.parse(search);

  try {
    statements = JSON.parse(atob(statements));
  } catch (e) {
    statements = [];
  }

  console.log('statements: ', statements);

  return (
    <Paper className={classes.root}>
      <div className={classes.tableContainer}>
        <DisordersWithScoresTable statements={statements} />
      </div>
    </Paper>
  );
}

export default withStyles(styles)(DisordersScores);
