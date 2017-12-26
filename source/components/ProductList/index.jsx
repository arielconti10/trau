import React, { PropTypes } from 'react';
import './ProductList.css';

function ProductList({ children, noSideBar }) {
  return (
    <div className="container-fluid" styleName={`list ${noSideBar ? 'list--nosidebar' : ''}`}>
      {children}
    </div>
  );
}

ProductList.propTypes = {
  children: PropTypes.node.isRequired,
  noSideBar: PropTypes.bool,
};

ProductList.defaultProps = {
  noSideBar: false,
};

export default ProductList;
