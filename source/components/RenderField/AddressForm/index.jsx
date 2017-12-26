import React from 'react';
import './RenderFieldAddresForm.css';

const RenderFieldAddresForm = ({ input, label, type, disabled, characterLimit }) => (
  <div>
    <input
      {...input}
      placeholder={label}
      type={type}
      styleName="center input"
      disabled={disabled}
      maxLength={`${characterLimit}`}
    />
  </div>
);


RenderFieldAddresForm.propTypes = Object.assign({});

export default RenderFieldAddresForm;
