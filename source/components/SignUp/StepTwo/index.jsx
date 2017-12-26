import React, { PropTypes } from 'react';
import { Field, reduxForm } from 'redux-form';
import TitleHeader from 'Components/TitleHeader';
import { normalizeCEP } from 'Helpers/Normalize';
import '../SignUp.css';

function StepTwo({ handleSubmit, pristine, submitting }) {
  const required = (value) => {
    if (value) {
      return undefined;
    }
    return 'Required';
  };

  return (
    <div className="container">
      <TitleHeader showBackButton >Seu Endereço</TitleHeader>
      <form onSubmit={handleSubmit}>
        <section styleName="box center">
          <Field
            styleName="input"
            component="input"
            name="zipcode"
            type="text"
            placeholder="CEP*"
            validate={required}
            normalize={normalizeCEP}
          />
          <Field
            styleName="input"
            component="input"
            name="description"
            type="text"
            placeholder="Endereço*"
            validate={required}
          />
          <Field
            styleName="input"
            className="col-xs-3"
            component="input"
            name="number"
            type="text"
            placeholder="Núm.*"
            validate={required}
          />
          <Field
            styleName="input margin-left"
            className="col-xs-8"
            component="input"
            name="sub_description"
            type="text"
            placeholder="Compl."
          />
          <Field
            styleName="input"
            className="col-xs-8"
            component="input"
            name="city"
            type="text"
            placeholder="Cidade*"
            validate={required}
          />
          <Field
            styleName="input margin-left"
            className="col-xs-3"
            component="input"
            name="state"
            type="text"
            placeholder="Estado*"
            validate={required}
          />
          <Field
            styleName="input"
            component="input"
            name="password"
            type="password"
            placeholder="Senha*"
            validate={required}
          />
          <Field
            styleName="input"
            component="input"
            name="confirmpassword"
            type="password"
            placeholder="Confirmar Senha*"
            validate={required}
          />
        </section>
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
        </section>
      </form>
    </div>
  );
}

StepTwo.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  pristine: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
};

export default reduxForm({ form: 'stepTwo' })(StepTwo);
