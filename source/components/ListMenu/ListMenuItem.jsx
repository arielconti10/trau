import React, { PropTypes } from 'react';
import { Link, withRouter } from 'react-router-dom';
import './ListMenu.css';

function ListMenuItem({ to, children, styles, onClick, hasAction }) {
  const styleName = `link ${styles}`;
  const item = !hasAction ?
    <Link styleName={styleName} to={`${to}`}>{children}</Link> :
    <button styleName={styleName} onClick={onClick}>{children}</button>;
  return (
    <li styleName="item">
      {item}
    </li>
  );
}

ListMenuItem.propTypes = {
  to: PropTypes.string,
  children: PropTypes.string.isRequired,
  styles: PropTypes.string,
  onClick: PropTypes.func,
  hasAction: PropTypes.bool,
};

ListMenuItem.defaultProps = {
  to: '/',
  styles: '',
  alwaysVisible: false,
  hasAction: false,
  onClick: () => {},
};

export default withRouter(ListMenuItem);
