import React, { PropTypes } from 'react';
import './FacebookButtonSimple.css';

function FacebookButtonSimple({ handleSubmitFacebook }) {
  return (
    <button styleName="button-facebook text-facebook btn-social" onClick={handleSubmitFacebook}>
      <span styleName="position-text">Entrar com Facebook</span>
    </button>
  );
}

FacebookButtonSimple.propTypes = {
  handleSubmitFacebook: PropTypes.func.isRequired,
};

export default FacebookButtonSimple;
