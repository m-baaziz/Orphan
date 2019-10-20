import React from 'react';
import { Link } from 'react-router-dom';
import { withStyles } from '@material-ui/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

const styles = (theme) => ({
  appBar: {
  },
  toolbar: {
  },
  link: {
    textDecoration: 'none',
    color: 'inherit',
  },
  toolbarTitle: {
    flexGrow: 1,
  },
});

function AppBarComponent(props) {
  const { classes } = props;

  return (
    <AppBar className={classes.appBar}>
      <Toolbar className={classes.toolbar}>
        <Typography variant="h6" color="inherit" noWrap className={classes.toolbarTitle}>
          <Link to="/" className={classes.link}>
            Orphan
          </Link>
        </Typography>
      </Toolbar>
    </AppBar>
  );
}

export default withStyles(styles)(AppBarComponent);
