import React, { PropTypes } from 'react';
import './FalseField.css';

const FalseField = ({ defaultValue, disabled, hoverMessage }) => (
  <span styleName={`field ${(disabled ? 'disabled' : '')}`} title={hoverMessage}>{defaultValue}</span>
);

FalseField.propTypes = Object.assign({
  defaultValue: PropTypes.string.isRequired,
  hoverMessage: PropTypes.string,
});

FalseField.defaultProps = {
  hoverMessage: '',
};

export default FalseField;
