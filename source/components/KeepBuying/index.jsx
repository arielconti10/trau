import React, { PropTypes } from 'react';
import { Link, withRouter } from 'react-router-dom';
import './KeepBuying.css';

function KeepBuying({ children }) {
  return (
    <Link styleName="keep-buying" to={'/'}>{children}</Link>
  );
}

KeepBuying.propTypes = {
  children: PropTypes.node,
};

KeepBuying.defaultProps = {
  children: 'Continuar Comprando',
};

export default withRouter(KeepBuying);
