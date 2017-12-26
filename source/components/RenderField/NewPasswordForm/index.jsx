import React from 'react';
import './RenderFieldNewPasswordForm.css';

const RenderFieldNewPasswordForm = ({ input, label, type, meta: { touched, error } }) => (
  <div>
    <input
      {...input}
      placeholder={label}
      type={type}
      styleName="input"
    />
    {touched && ((error && <span styleName="errors">{error}</span>))}
  </div>
);


RenderFieldNewPasswordForm.propTypes = Object.assign({});

export default RenderFieldNewPasswordForm;
