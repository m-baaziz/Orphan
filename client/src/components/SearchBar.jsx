import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';

const styles = (theme) => ({
  root: {
    padding: '2px 4px',
    display: 'flex',
    alignItems: 'center',
    width: 600,
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
  },
  iconButton: {
    padding: 10,
  },
  divider: {
    height: 28,
    margin: 4,
  },
});

function SearchBar(props) {
  const {
    className, classes, placeholder, onChange,
  } = props;

  return (
    <Paper className={classNames(classes.root, className)}>
      <InputBase
        className={classes.input}
        placeholder={placeholder}
        inputProps={{ 'aria-label': placeholder }}
        onChange={onChange}
      />
      <IconButton className={classes.iconButton} aria-label="search">
        <SearchIcon />
      </IconButton>
    </Paper>
  );
}

export default withStyles(styles)(SearchBar);
