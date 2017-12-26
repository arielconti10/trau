import React, { PropTypes } from 'react';
import TitleHeader from 'Components/TitleHeader';
import { Field, reduxForm } from 'redux-form';
import errors from 'Helpers/Errors';
import validate from 'Helpers/Validate/formResetPassword';
import RenderFieldNewPasswordForm from 'Components/RenderField/NewPasswordForm';
import './NewPasswordForm.css';

function NewPasswordForm({ handleSubmit, pristine, submitting, showError }) {
  return (
    <div className="container">
      <TitleHeader>Recuperar senha</TitleHeader>
      <div styleName="form-wrapper">
        {showError !== 'resettoken.invalid_value' &&
          <form onSubmit={handleSubmit}>
            <Field
              component={RenderFieldNewPasswordForm} name="password" type="password"
              label="Insira sua nova senha*"
            />
            <Field
              component={RenderFieldNewPasswordForm} name="passwordRepeat" type="password"
              label="Repita a nova senha*"
            />
            {showError && <span styleName="errors">{errors(showError)}</span>}
            <button styleName="btn-login" type="submit" disabled={pristine || submitting}>
              Definir nova senha
            </button>
          </form>
        }
        {showError === 'resettoken.invalid_value' &&
          <span styleName="errors-block">{errors(showError)}</span>
        }
      </div>
    </div>
  );
}

NewPasswordForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  pristine: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
  showError: PropTypes.string,
};

NewPasswordForm.defaultProps = {
  showError: null,
};

export default reduxForm({ form: 'newPasswordForm', validate })(NewPasswordForm);
