import React, { PropTypes, Component } from 'react';
import { compose } from 'recompose';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import validate from 'Helpers/Validate';
import RenderFieldSignUp from 'Components/RenderField/SignUp';
import { connectFacebook, addToCart } from 'Actions';
import errors from 'Helpers/Errors';
import './FacebookSignupDocumentStep.css';

class FacebookSignupDocumentStep extends Component {
  constructor(props) {
    super(props);
    this.handleSubmitUserFacebook = this.handleSubmitUserFacebook.bind(this);
  }

  handleSubmitUserFacebook() {
    const values = this.props.form.FacebookSignupDocumentStep.values;
    const { dataFacebook } = this.props;
    dataFacebook.cpf = values.cpf;
    this.props.connectFacebook(dataFacebook).then(() => {
      this.props.addToCart(this.props.cart.id, this.props.user.id);
    });
  }

  render() {
    const { showErrors } = this.props;
    return (
      <div styleName="fsd-wrapper">
        <h3 styleName="title">Insira seu CPF</h3>
        <form styleName="fsd-form">
          <Field
            component={RenderFieldSignUp}
            name="cpf"
            type="text"
            label="CPF*"
          />
          {showErrors && <span styleName="errors">{errors(showErrors)}</span>}
          <button
            styleName="btn-continue"
            type="button"
            onClick={this.handleSubmitUserFacebook}
          >
            Salvar
          </button>
        </form>
        <p styleName="fsd-description">
          Informe seu CPF para finalizar o cadastro. Ele será utilizado
          apenas quando você finalizar uma compra e será armazenado em
          ambiente totalmente seguro</p>
      </div>
    );
  }
}

FacebookSignupDocumentStep.propTypes = {
  connectFacebook: PropTypes.func.isRequired,
  addToCart: PropTypes.func.isRequired,
  dataFacebook: PropTypes.shape({}).isRequired,
  form: PropTypes.shape({
    FacebookSignupDocumentStep: PropTypes.shape({
      values: PropTypes.shape({
        cep: '',
      }),
    }),
  }).isRequired,
  user: PropTypes.shape({
    token: PropTypes.string,
    cpf: PropTypes.string,
    error: PropTypes.bool,
    facebookData: PropTypes.any,
    id: PropTypes.number,
  }).isRequired,
  cart: PropTypes.shape({
    id: PropTypes.node,
  }).isRequired,
  showErrors: PropTypes.string,
};


FacebookSignupDocumentStep.defaultProps = {
  form: {
    FacebookSignupDocumentStep: {
      values: {
        cep: '',
      },
    },
  },
  showErrors: null,
};

function mapStateToProps(state) {
  return state;
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    connectFacebook,
    addToCart,
  }, dispatch);
}

const enhance = compose(
  reduxForm({ form: 'FacebookSignupDocumentStep', validate }),
  connect(mapStateToProps, mapDispatchToProps),
);

export default enhance(FacebookSignupDocumentStep);
