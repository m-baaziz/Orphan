import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';

import Areas from '../hoc/Areas';
import AreaBtn from './AreaBtn';

const styles = (theme) => ({
  root: {
    minHeight: 500,
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  textInputsAndBtnContainer: {
    display: 'flex',
    flexDirection: 'column',
  },
  textInputsContainer: {
    padding: 10,
  },
  textInputContainer: {
    margin: 'auto',
    display: 'flex',
    justifyContent: 'space-around',
  },
  deleteContainer: {
    display: 'flex',
  },
  deleteBtn: {
    margin: 'auto',
    marginLeft: 5,
  },
  addBtn: {
    margin: 'auto',
  },
  flexGrow: {
    flexGrow: 1,
  },
});

function Statements(props) {
  const { classes, statements, onStatementsChange } = props;
  const [activeArea, setActiveArea] = React.useState();

  const onAreaClick = (HPOId) => {
    if (!statements[HPOId]) {
      onStatementsChange({
        ...statements,
        [HPOId]: [''],
      });
    }
    setActiveArea(HPOId);
  };

  const onAddStatementClick = () => {
    onStatementsChange({
      ...statements,
      [activeArea]: [...statements[activeArea], ''],
    });
  };

  const onStatementTextChange = (index) => (event) => {
    const text = event.target.value;
    const statementTexts = [...statements[activeArea]];
    statementTexts[index] = text;
    onStatementsChange({
      ...statements,
      [activeArea]: statementTexts,
    });
  };

  const onDeleteClick = (index) => () => {
    const texts = [...statements[activeArea]];
    texts.splice(index, 1);
    onStatementsChange({
      ...statements,
      [activeArea]: texts,
    });
  };

  const TextInput = ({ index }) => (
    <TextField
      id="outlined-bare"
      className={classes.textField}
      defaultValue={statements[activeArea][index]}
      margin="normal"
      variant="outlined"
      fullWidth
      autoComplete="off"
      onBlur={onStatementTextChange(index)}
    />
  );

  const DeleteButton = ({ index }) => (
    <IconButton
      aria-label="delete"
      className={classes.deleteBtn}
      onClick={onDeleteClick(index)}
    >
      <DeleteIcon fontSize="small" />
    </IconButton>
  );

  const AreaBtnGroup = ({ areas }) => (
    <>
      { areas.map((area) => (
        <AreaBtn
          key={area.HPOId}
          area={area}
          active={activeArea === area.HPOId || (statements[area.HPOId] && statements[area.HPOId].filter((s) => s).length > 0)}
          onClick={onAreaClick}
        />
      ))}
    </>
  );

  return (
    <div className={classes.root}>
      <div>
        <Areas render={AreaBtnGroup} />
      </div>
      {!activeArea ? null : (
        <div className={classes.textInputsAndBtnContainer}>
          <div className={classes.textInputsContainer}>
            {statements[activeArea].map((_, index) => (
              /* eslint-disable-next-line react/no-array-index-key */
              <div key={`${activeArea}-${index}`} className={classes.textInputContainer}>
                <div className={classes.flexGrow}>
                  <TextInput index={index} />
                </div>
                <div className={classes.deleteContainer}>
                  <DeleteButton index={index} />
                </div>
              </div>
            ))}
          </div>
          <div className={classes.addBtn}>
            <Button
              className={classes.btn}
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={onAddStatementClick}
            >
              Statement
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default withStyles(styles)(Statements);
