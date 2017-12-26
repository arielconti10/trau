import React, { PropTypes } from 'react';
import TitleHeader from 'Components/TitleHeader';
import { Field, reduxForm } from 'redux-form';
import { Link } from 'react-router-dom';
import './RecoverPasswordForm.css';

function RecoverPasswordForm({ handleSubmit, pristine, submitting, sendMail }) {
  function email(value) {
    if (value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)) {
      return 'Invalid email address';
    }
    return undefined;
  }

  function required(value) {
    if (value) {
      return undefined;
    }
    return 'Required';
  }

  return (
    <div className="container">
      <TitleHeader showBackButton>Recuperar senha</TitleHeader>
      <form onSubmit={handleSubmit}>
        <div styleName="wrapper">
          <div>
            <p>
              <Field
                styleName="input"
                component="input"
                name="email"
                type="text"
                placeholder="Insira seu e-mail de cadastro."
                validate={[email, required]}
              />
            </p>
            {sendMail &&
              <span styleName="warning">
                Foi enviado um email para redefinir sua senha no endereço informado acima.
              </span>
            }
            <div styleName="login-panel">
              <button styleName="btn-login" type="submit" disabled={pristine || submitting}>
                Definir nova senha
              </button>
            </div>
          </div>
          <div styleName="footer-login">
            <Link styleName="text-footer" to={'/login'}>Ainda não tenho cadastro</Link>
          </div>
        </div>
      </form>
    </div>
  );
}


RecoverPasswordForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  pristine: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
  sendMail: PropTypes.bool.isRequired,
};

export default reduxForm({ form: 'recoverPasswordForm' })(RecoverPasswordForm);
