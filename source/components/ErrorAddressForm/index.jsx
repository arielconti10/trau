import React from 'react';
import './ErrorAddressForm.css';

const errorAddressForm = ({ error }) => (
  <span styleName="error">{error}</span>
);

errorAddressForm.propTypes = Object.assign({});

export default errorAddressForm;
