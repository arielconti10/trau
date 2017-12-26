import React, { PropTypes } from 'react';
import { Field, reduxForm } from 'redux-form';
import { Link } from 'react-router-dom';
import './Login.css';

function LoginForm({
   handleSubmit, showErrors, pristine, submitting }) {
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
    <div>
      <form onSubmit={handleSubmit}>
        <Field
          styleName="input"
          component="input"
          name="email"
          type="text"
          placeholder="E-mail"
          validate={[email, required]}
        />
        <Field
          styleName="input"
          component="input"
          name="password"
          type="password"
          placeholder="Senha"
          validate={[required]}
        />

        {showErrors && <div styleName="errors">
          Usuário e senha inválidos.
        </div>}

        <div styleName="login-panel">
          <Link to={'/recover-password'} styleName="btn-password">Esqueci minha senha</Link>
          <button
            styleName="btn-login" type="submit" disabled={pristine || submitting}
          >
            Entrar
          </button>
        </div>
      </form>
    </div>
  );
}

LoginForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  pristine: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
  showErrors: PropTypes.bool.isRequired,
};

export default reduxForm({ form: 'loginForm' })(LoginForm);
