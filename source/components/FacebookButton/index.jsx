import React, { PropTypes } from 'react';
import { FacebookLogin } from 'react-facebook-login-component';
import { facebook as facebookConfig } from 'Config/Constants';
import './FacebookButton.css';

function FacebookButton({ handleConnectFacebook }) {
  return (
    <div styleName="button-facebook text-facebook btn-social">
      <span styleName="position-text">Entrar com Facebook</span>
      <FacebookLogin
        socialId={facebookConfig.id}
        language="en_US"
        scope="public_profile,email"
        responseHandler={handleConnectFacebook}
        fields="id,email,name,cover"
        version="v2.5"
        class="global-class-button-facebook"
        buttonText="Entrar com Facebook"
      />
    </div>
  );
}

FacebookButton.propTypes = {
  handleConnectFacebook: PropTypes.func.isRequired,
};

export default FacebookButton;
