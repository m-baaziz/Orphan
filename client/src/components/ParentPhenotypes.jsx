import React from 'react';
import { QueryRenderer } from 'react-relay';
import graphql from 'babel-plugin-relay/macro';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import SendIcon from '@material-ui/icons/Send';

import environment from '../api/environment';

import Phenotype from '../hoc/Phenotype';
import ParentPhenotypeBtn from './ParentPhenotypeBtn';

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
  },
  addBtn: {
    margin: 'auto',
  },
  sendBtn: {
    position: 'fixed',
    bottom: 10,
    right: 10,
  },
  flexGrow: {
    flexGrow: 1,
  },
});

function ParentPhenotypes(props) {
  const { classes } = props;
  const [activeParent, setActiveParent] = React.useState();
  const [statements, setStatements] = React.useState({});

  const onParentPhenotypeClick = (HPOId) => {
    if (!statements[HPOId]) {
      setStatements({
        ...statements,
        [HPOId]: [''],
      });
    }
    setActiveParent(HPOId);
  };

  const onAddStatementClick = () => {
    setStatements({
      ...statements,
      [activeParent]: [...statements[activeParent], ''],
    });
  };

  const onStatementTextChange = (index) => (event) => {
    const text = event.target.value;
    const statementTexts = [...statements[activeParent]];
    statementTexts[index] = text;
    setStatements({
      ...statements,
      [activeParent]: statementTexts,
    });
  };

  const onDeleteClick = (index) => () => {
    const texts = [...statements[activeParent]];
    texts.splice(index, 1);
    setStatements({
      ...statements,
      [activeParent]: texts,
    });
  };

  const onSendStatementsClick = () => {
    console.log('statements: ', statements);
  };

  const TextInput = ({ index }) => (
    <TextField
      id="outlined-bare"
      className={classes.textField}
      defaultValue={statements[activeParent][index]}
      margin="normal"
      variant="outlined"
      fullWidth
      onBlur={onStatementTextChange(index)}
    />
  );

  const DeleteButton = ({ index }) => (
    <IconButton aria-label="delete" className={classes.deleteBtn} onClick={onDeleteClick(index)}>
      <DeleteIcon fontSize="small" />
    </IconButton>
  );

  return (
    <QueryRenderer
      environment={environment}
      query={graphql`
          query ParentPhenotypesQuery {
            parentPhenotypes {
              HPOId
              ...Phenotype_phenotype
            }
          }
        `}
      variables={{}}
      render={(res) => {
        const { error, props: data } = res;
        if (error) {
          return <div>Error!</div>;
        }
        if (!data) {
          return <div>Loading...</div>;
        }

        return (
          <div className={classes.root}>
            <div>
              { data.parentPhenotypes.map((phenotype) => (
                <Phenotype
                  key={phenotype.HPOId}
                  phenotype={phenotype}
                  render={ParentPhenotypeBtn}
                  renderProps={{
                    active: statements[phenotype.HPOId] && statements[phenotype.HPOId].length > 0,
                    onClick: onParentPhenotypeClick,
                  }}
                />
              )) }
            </div>
            {!activeParent ? null : (
              <div className={classes.textInputsAndBtnContainer}>
                <div className={classes.textInputsContainer}>
                  {statements[activeParent].map((_, index) => (
                    /* eslint-disable-next-line react/no-array-index-key */
                    <div key={`${activeParent}-${index}`} className={classes.textInputContainer}>
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

            <div className={classes.sendBtn}>
              <Fab
                className={classes.btn}
                color="primary"
                onClick={onSendStatementsClick}
              >
                <SendIcon />
              </Fab>
            </div>
          </div>
        );
      }}
    />
  );
}

export default withStyles(styles)(ParentPhenotypes);
