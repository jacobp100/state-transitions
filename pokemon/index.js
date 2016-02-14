import React from 'react';
import { render } from 'react-dom';
import Router, { Route, IndexRoute } from 'react-router';

import List from './src/List';
import View from './src/View';


class App extends React.Component {
  render() {
    return (
      <div>
        { this.props.children }
      </div>
    );
  }
}

App.propTypes = {
  children: React.PropTypes.object,
};

render((
  <Router>
    <Route path="/" component={ App }>
      <Route path="view/:id" component={ View } />
      <IndexRoute component={ List } />
    </Route>
  </Router>
), document.getElementById('MAIN'));
