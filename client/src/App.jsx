import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';
import CssBaseline from '@material-ui/core/CssBaseline';
import { createMuiTheme, withStyles } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import blue from '@material-ui/core/colors/blue';
import orange from '@material-ui/core/colors/orange';

import AppBar from './components/AppBar';
import Home from './views/Home';
import Disorders from './views/Disorders';

const theme = createMuiTheme({
  palette: {
    primary: blue,
    secondary: orange,
  },
});

const styles = () => ({
  root: {
    display: 'flex',
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
  },
  appBarSpacer: theme.mixins.toolbar,
});

function App(props) {
  const { classes } = props;

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <div>
          <CssBaseline />
          <AppBar />
          <main className={classes.content}>
            <div className={classes.appBarSpacer} />
            <Switch>
              <Route path="/" exact component={Home} />
              <Route path="/disorders" component={Disorders} />
            </Switch>
          </main>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default withStyles(styles)(App);
