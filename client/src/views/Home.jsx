import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';

import ParentPhenotypes from '../components/ParentPhenotypes';

const styles = () => ({
  root: {
    margin: 10,
    padding: 10,
  },
});

function Home(props) {
  const { classes } = props;
  return (
    <Paper className={classes.root}>
      <ParentPhenotypes />
    </Paper>
  );
}

export default withStyles(styles)(Home);
