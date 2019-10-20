import React from 'react';
import sortBy from 'lodash/sortBy';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';

const DEFAULT_ROWS_PER_PAGE_OPTIONS = [10, 20, 30];

function processTableRows(rows, sorting, page, rowsPerPage) {
  const sort = (row) => Object.keys(row).reduce((acc, key) => (sorting[key] ? [...acc, (o) => sorting[key] * o[key]] : acc), []);
  return sortBy(rows, sort).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
}

const styles = () => ({});

function CustomTable(props) {
  const {
    classes, items, cols, rowsPerPageOptions = DEFAULT_ROWS_PER_PAGE_OPTIONS,
  } = props;
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(rowsPerPageOptions[0]);
  const [sorting, setSorting] = React.useState(Object.keys(cols).reduce((acc, key) => ({ ...acc, [key]: 0 }), {}));

  const itemToRow = (item) => Object.keys(cols).reduce((acc, key) => ({ ...acc, [key]: cols[key](item) }), {});
  const rows = processTableRows(items.map(itemToRow), sorting, page, rowsPerPage);

  const onHeaderSortClick = (header) => () => {
    setSorting({
      ...sorting,
      [header]: sorting[header] ? -sorting[header] : 1,
    });
  };

  const onRowClick = (row) => (event) => {
    event.preventDefault();
    console.log('clicked on ', row);
  };

  const onChangePage = (event, value) => {
    setPage(value);
  };
  const onChangeRowsPerPage = (event) => {
    const { target: { value } } = event;
    setRowsPerPage(value);
    setPage(0);
  };

  const Header = () => (
    <TableHead>
      <TableRow>
        {Object.keys(sorting).map((header) => (
          <TableCell
            key={header}
            sortDirection={!!sorting[header] && (sorting[header] > 0 ? 'asc' : 'desc')}
          >
            <TableSortLabel
              active={!!sorting[header]}
              direction={(!!sorting[header] && (sorting[header] > 0 ? 'asc' : 'desc')) || 'asc'}
              onClick={onHeaderSortClick(header)}
            >
              {header}
              {sorting[header] ? (
                <span className={classes.visuallyHidden}>
                  {sorting[header] < 0 ? 'sorted descending' : 'sorted ascending'}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );

  return (
    <div className={classes.root}>
      <div className={classes.tableWrapper}>
        <Table
          className={classes.table}
          aria-labelledby="tableTitle"
          size="medium"
        >
          <Header />
          <TableBody>
            {rows.map((row, index) => (
              <TableRow
                hover
                onClick={onRowClick(row)}
                tabIndex={-1}
                // eslint-disable-next-line react/no-array-index-key
                key={index}
              >
                {/* eslint-disable-next-line no-restricted-globals */}
                { Object.keys(cols).map((key) => <TableCell key={key} align={isNaN(row[key]) ? 'left' : 'right'}>{row[key]}</TableCell>)}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <TablePagination
        rowsPerPageOptions={rowsPerPageOptions}
        component="div"
        count={items.length}
        rowsPerPage={rowsPerPage}
        page={page}
        backIconButtonProps={{
          'aria-label': 'previous page',
        }}
        nextIconButtonProps={{
          'aria-label': 'next page',
        }}
        onChangePage={onChangePage}
        onChangeRowsPerPage={onChangeRowsPerPage}
      />
    </div>
  );
}

export default withStyles(styles)(CustomTable);
