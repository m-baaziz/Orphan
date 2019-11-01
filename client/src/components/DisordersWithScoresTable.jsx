import React from 'react';
import { withStyles } from '@material-ui/core/styles';

import DisordersWithScores from '../hoc/DisordersWithScores';
import Table from './Table';
import SearchBar from './SearchBar';


const styles = () => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
  },
  searchBar: {
    margin: 'auto',
    marginBottom: 20,
  },
});

function round(num, digits = 2) {
  return +num.toFixed(digits);
}

function DisordersWithScoresTable(props) {
  const [search, setSearch] = React.useState('');
  const { classes, disordersWithScores } = props;

  const onSearchBarChange = (event) => {
    const { value } = event.target;
    setSearch(value);
  };

  let disorders = Array.isArray(disordersWithScores) ? disordersWithScores : [];
  disorders = search
    ? disordersWithScores.filter(({ disorder: { name, description } }) => (name && name.includes(search))
      || (description && description.includes(search)))
    : disordersWithScores;

  return (
    <div className={classes.root}>
      <SearchBar
        className={classes.searchBar}
        placeholder="Search Disorder"
        onChange={onSearchBarChange}
      />
      <Table
        items={disorders || []}
        cols={{
          orphaNumber: ({ disorder: { orphaNumber } }) => orphaNumber,
          name: ({ disorder: { name } }) => name,
          description: ({ disorder: { description } }) => description,
          score: ({ score }) => round(score),
        }}
      />
    </div>
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
