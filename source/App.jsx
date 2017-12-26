import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
} from 'react-router-dom';
import Main from 'Containers/Main';
import Facebooklogin from 'Containers/FacebookLogin';
import RecoverPassword from 'Containers/RecoverPassword';
import NewPassword from 'Containers/NewPassword';
import Error from 'Components/Error';
import { compose, withProps, lifecycle, branch, renderComponent } from 'recompose';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchStore } from 'Actions';
import { shopSelector } from 'Reducers/StoreReducer';
import getSubdomain from 'Helpers/getSubdomain';
import './assets/styles/Global.css';


const App = ({ slug }) => (
  <Router>
    <Route path="/" component={props => <Main {...props} slug={slug} />} />
  </Router>
);

const enhance = compose(
  withProps({ slug: getSubdomain() }),
  connect(
    state => ({ shop: shopSelector(state) }),
    dispatch => bindActionCreators({ fetchStore }, dispatch),
  ),
  lifecycle({
    componentWillMount() {
      this.props.fetchStore(this.props.slug);
    },
  }),

  branch(
    ({ slug }) => slug === 'login',
    renderComponent(
      ({ slug }) => (
        <Router>
          <Switch>
            <Route path={'/loginfb/:store'} component={props => <Facebooklogin {...props} slug={slug} />} />
            <Route path={'/recover-password'} component={RecoverPassword} />
            <Route path={'/new-password'} component={NewPassword} />
          </Switch>
        </Router>
      ),
    ),
  ),

  branch(
    ({ shop: { error } }) => !!error,
    renderComponent(Error),
  ),
);

export default enhance(App);
