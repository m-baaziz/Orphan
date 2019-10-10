import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

const styles = (theme) => ({
  button: {
    margin: theme.spacing(1),
  },
});

function ParentPhenotypeBtn(props) {
  const {
    classes, HPOId, name, description, active, onClick,
  } = props;

  const onClickHander = (event) => {
    event.preventDefault();
    onClick(HPOId);
  };

  const simplifyName = (n) => n.replace(/(An )?[aA]bnormality of( the)?/g, '');

  return (
    <Button variant="outlined" color={active ? 'primary' : 'default'} className={classes.button} onClick={onClickHander}>
      <span title={description}>{simplifyName(name)}</span>
    </Button>
  );
}

export default withStyles(styles)(ParentPhenotypeBtn);
