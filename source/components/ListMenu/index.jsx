import React, { PropTypes } from 'react';
import './ListMenu.css';

function ListMenu({ children, type }) {
  return (
    <nav styleName={`wrapper ${type}`}>
      <div id="outer-container">
        <ul styleName="list">
          {children}
        </ul>
        {/* <ul styleName="list">
          <li styleName="item">
            <a styleName="link" href="/example/">Link Normal</a>
          </li>
          <li styleName="item">
            <a styleName="link--faded" href="/example/">Link Discreto</a>
          </li>
        </ul> */}
      </div>
    </nav>
  );
}

ListMenu.propTypes = {
  children: PropTypes.node.isRequired,
  type: PropTypes.string,
};

ListMenu.defaultProps = {
  type: 'list',
};

export default ListMenu;
