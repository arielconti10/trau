import React, { Component, PropTypes } from 'react';
import FacebookButton from 'Components/FacebookButton';
import TitleHeader from 'Components/TitleHeader';
import validate from 'Helpers/Validate';
import errors from 'Helpers/Errors';
import { Field, reduxForm, propTypes } from 'redux-form';
import { normalizePhone, normalizeCPF } from 'Helpers/Normalize';
import RenderFieldSignUp from 'Components/RenderField/SignUp';
import '../SignUp.css';

class StepOne extends Component {

  static lower(value) {
    return value && value.toLowerCase();
  }

  componentWillReceiveProps(nextProps) {
    const { facebookData } = nextProps;
    if (facebookData && facebookData.token) {
      this.props.change('name', facebookData.name);
      this.props.change('username', facebookData.username);
    }
  }

  render() {
    const { handleSubmit, pristine, submitting, handleConnectFacebook, showErrors } = this.props;
    return (
      <div className="container">
        <TitleHeader showBackButton />
        <section styleName="facebookButtonSize">
          <FacebookButton handleConnectFacebook={handleConnectFacebook} />
        </section>
        <section styleName="text-center">
          <p styleName="loginsplitter">OU</p>
        </section>
        <form onSubmit={handleSubmit}>
          <section>
            <Field component={RenderFieldSignUp} name="name" type="text" label="Nome*" />
            <Field
              component={RenderFieldSignUp} name="username" type="mail" label="E-mail*"
              normalize={StepOne.lower}
            />
            <Field
              component={RenderFieldSignUp} name="cpf" type="text" label="CPF*"
              normalize={normalizeCPF}
            />
            <Field
              component={RenderFieldSignUp} name="cel_phone" type="text" label="Telefone*"
              normalize={normalizePhone}
            />
            <Field
              component={RenderFieldSignUp} name="password" type="password" label="Senha*"
            />
            <Field
              component={RenderFieldSignUp} name="confirmpassword" type="password"
              label="Confirmar Senha*"
            />
          </section>
          {showErrors && <span styleName="errors">{errors(showErrors)}</span>}
          <section>
            <span styleName="center text-footer">*Campos de preenchimento obrigatório</span>
            <div styleName="register-panel">
              <button
                styleName="btn-continue"
                type="submit"
                disabled={pristine || submitting}
              >
                Concluir
              </button>
            </div>
            <span styleName="center text-footer">
              Ao continuar você concorda com os <a href="http://privacy.lua.net/lua_net_termos_de_uso_comprador.htm" target="_blank" rel="noopener noreferrer">termos</a> e <a rel="noopener noreferrer" href="http://privacy.lua.net/lua_net_politica_de_privacidade.htm" target="_blank">política de privacidade</a> da Lua
            </span>
          </section>
        </form>
      </div>
    );
  }
}

StepOne.propTypes = Object.assign({
  handleSubmit: PropTypes.func.isRequired,
  pristine: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
  handleConnectFacebook: PropTypes.func.isRequired,
  showErrors: PropTypes.string,
  user: PropTypes.shape({
    token: PropTypes.string,
    error: PropTypes.bool,
    facebookData: PropTypes.any,
  }).isRequired,
}, propTypes);

StepOne.defaultProps = {
  user: {},
  showErrors: null,
};

export default reduxForm({
  form: 'stepOne',
  validate,
})(StepOne);
