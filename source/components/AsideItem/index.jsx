import React, { PropTypes } from 'react';
import './AsideItem.css';

function AsideItem({ title, children, type, onAction }) {
  return (
    <div styleName="wrapper">
      <button styleName={`icon icon--${type}`} onClick={onAction}>Expandir/Compactar</button>
      {title && <span styleName="title">{title}</span>}
      {children}
    </div>
  );
}

AsideItem.propTypes = {
  title: PropTypes.string,
  children: PropTypes.node.isRequired,
  type: PropTypes.string,
  onAction: PropTypes.func,
};

AsideItem.defaultProps = {
  title: '',
  type: 'default',
  onAction: () => {},
};

export default AsideItem;
