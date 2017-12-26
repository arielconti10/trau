import React from 'react';
import Error from 'Components/Error';
import { compose } from 'recompose';
import { withRouter } from 'react-router-dom';

const ErrorView = ({ match: { params: { code } } }) => <Error statusCode={code} />;

const enhance = compose(
  withRouter,
);

export default enhance(ErrorView);
