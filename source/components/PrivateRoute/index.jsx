import React, { PropTypes } from 'react';
import { Redirect, Route } from 'react-router-dom';

const PrivateRoute = ({ component, path, slug, isAuthenticated }) => (
  <Route
    {...path}
    render={attrs => (
      isAuthenticated ? (
        React.createElement(component, attrs)
      ) : (
        <Redirect
          to={{
            pathname: `/${slug}/login`,
            state: { from: attrs.location },
          }}
        />
      )
    )}
  />
);

PrivateRoute.propTypes = {
  component: PropTypes.func.isRequired,
  path: PropTypes.string.isRequired,
  slug: PropTypes.string.isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
};

export default PrivateRoute;
