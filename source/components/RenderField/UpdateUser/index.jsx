import React from 'react';
import './RenderFieldUpdateUser.css';

const RenderFieldUpdateUser = ({ input, label, type, meta: { touched, error } }) => (
  <div styleName="input-wrapper">
    <input {...input} placeholder={label} type={type} styleName="input" />
    {touched && ((error && <span styleName="errors">{error}</span>))}
  </div>
);

RenderFieldUpdateUser.propTypes = Object.assign({});

export default RenderFieldUpdateUser;
