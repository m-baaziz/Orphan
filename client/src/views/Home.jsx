import React from 'react';
import reduce from 'lodash/reduce';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Fab from '@material-ui/core/Fab';
import SendIcon from '@material-ui/icons/Send';

import Statements from '../components/Statements';

const styles = () => ({
  root: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
  sendBtn: {
    position: 'fixed',
    bottom: 20,
    right: 20,
  },
});

function Home(props) {
  const { classes } = props;
  const [statements, setStatements] = React.useState({});

  const onSendStatementsClick = () => {
    const filteredStatements = reduce(statements, (acc, value, key) => {
      const unwrappedStatements = value.filter((s) => s).map((comment) => ({
        area: key,
        comment,
      }));
      return unwrappedStatements.length ? [
        ...acc,
        ...unwrappedStatements,
      ] : acc;
    }, []);
    const statementsHash = btoa(JSON.stringify(filteredStatements));
    const url = `/disorders${Object.keys(filteredStatements).length ? `?statements=${statementsHash}` : ''}`;
    props.history.push(url);
  };

  return (
    <Paper className={classes.root}>
      <Statements statements={statements} onStatementsChange={setStatements} />
      <div className={classes.sendBtn}>
        <Fab
          className={classes.btn}
          color="primary"
          onClick={onSendStatementsClick}
        >
          <SendIcon />
        </Fab>
      </div>
    </Paper>
  );
}

export default withStyles(styles)(Home);
