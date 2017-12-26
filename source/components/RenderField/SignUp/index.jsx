import React from 'react';
import './RenderFieldSignUp.css';

const RenderFieldSignUp = ({ input, label, type, meta: { touched, error } }) => (
  <div>
    <div>
      <input {...input} placeholder={label} type={type} styleName="center input" />
      {touched && ((error && <span styleName="errors">{error}</span>))}
    </div>
  </div>
);


RenderFieldSignUp.propTypes = Object.assign({});

export default RenderFieldSignUp;
