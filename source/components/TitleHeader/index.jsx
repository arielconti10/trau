import React, { PropTypes } from 'react';
import BackButton from 'Components/BackButton';
import './TitleHeader.css';

function TitleHeader({ children, showBackButton, view }) {
  return (
    <div styleName={`wrapper ${view ? 'hide-title' : ''}`}>
      {showBackButton && <div styleName="back-button"><BackButton /></div>}
      {!!children && <h1 styleName="title">{children}</h1>}
    </div>
  );
}

TitleHeader.propTypes = {
  children: PropTypes.node,
  showBackButton: PropTypes.bool,
  view: PropTypes.bool,
};

TitleHeader.defaultProps = {
  children: '',
  showBackButton: false,
  view: false,
};

export default TitleHeader;
