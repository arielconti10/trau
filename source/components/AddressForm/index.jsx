import React, { Component, PropTypes } from 'react';
import { compose } from 'recompose';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Field, reduxForm, propTypes } from 'redux-form';
import { fetchSaveAddressForUser, getAddressByZip, addToCart, logout } from 'Actions';
import { normalizeCEP, normalizePhone } from 'Helpers/Normalize';
import ErrorAddressForm from 'Components/ErrorAddressForm';
import FalseField from 'Components/FalseField';
import RenderFieldAddresForm from 'Components/RenderField/AddressForm';
import Loading from 'Components/Loading';
import './addressForm.css';

class AddressForm extends Component {
  constructor(props) {
    super(props);
    this.validateForm = this.validateForm.bind(this);
    this.changeAddress = this.changeAddress.bind(this);
    this.state = {
      checkAddress: false,
      error: false,
      errors: [],
    };
  }

  componentWillMount() {
    this.changeAddress();
  }

  isFromSaoPaulo() {
    const saoPauloZipcode = /^[01][0-9]{7}$/gm;
    const errors = {};
    const addressForm = this.props.form.addressForm;
    if (addressForm && addressForm.values && addressForm.values.cep) {
      const cep = addressForm.values.cep;
      if (!saoPauloZipcode.test(cep.replace('-', ''))) {
        errors.cep = 'CEP fora da área de cobertura. Atualmente as lojas na Lua operam apenas no estado de São Paulo.';
      } else {
        errors.cep = false;
        this.props.getAddressByZip(cep.replace('-', '')).then((data) => {
          if (!data.payload.error) {
            const address = this.props.user.address;
            this.props.change('cep', address.postcode);
            this.props.change('neighborhood', address.neighborhood);
            this.props.change('city', address.city);
            this.props.change('address', address.street);
          }
        });
      }
      this.setState({ errors });
    }
    return null;
  }

  changeAddress() {
    if (this.props.user && this.props.user.address) {
      const address = this.props.user.address;
      this.props.change('cep', address.postcode);
      this.props.change('neighborhood', address.neighborhood);
      this.props.change('number', address.number);
      this.props.change('city', address.city);
      this.props.change('address', address.street);
      this.props.change('telephone', address.telephone);
      if (address.street_complement) {
        this.props.change('complement', address.street_complement);
      }
    }
  }

  validateForm() {
    const saoPauloZipcode = /^[01][0-9]{7}$/gm;
    const address = this.props.form.addressForm.values;
    const errors = {};
    if (address.city === undefined || address.city.length === 0) {
      errors.city = 'O campo de Cidade é obrigatório.';
    }
    if (address.number === undefined || address.number.length === 0) {
      errors.number = 'O campo de Número é obrigatório.';
    }
    if (address.cep && !saoPauloZipcode.test(address.cep.replace('-', ''))) {
      errors.cep = 'CEP fora da área de cobertura. Atualmente as lojas na Lua operam apenas no estado de São Paulo.';
    }
    if (address.cep === undefined || (address.cep && address.cep.length < 8)) {
      errors.cep = 'O campo de CEP é obrigatório.';
    }
    if (address.address === undefined || address.address.length === 0) {
      errors.address = 'O campo de Endereço é obrigatório.';
    }
    if (address.neighborhood === undefined || address.neighborhood.length === 0) {
      errors.neighborhood = 'O campo de Bairro é obrigatório.';
    }
    if (address.telephone === undefined || address.telephone.length === 0) {
      errors.telephone = 'O campo de Telefone é obrigatório.';
    }
    if (address.telephone.length < 12) {
      errors.telephone = 'O campo de Telefone é inválido.';
    }
    if (Object.keys(errors).length === 0) {
      this.props.fetchSaveAddressForUser(address).then((data) => {
        if (data.payload.status === 401) {
          this.props.logout().then(() => {
            this.props.history.push('/login');
          });
        } else {
          if (this.props.cart && this.props.cart.id) {
            this.props.addToCart(this.props.cart.id, this.props.user.id);
          }
          this.props.handleSubmit();
        }
      });
    }

    this.setState({ errors });
  }

  render() {
    const required = value => (value ? undefined : 'Required');

    const showErrors = Object.keys(this.state.errors).map(error =>
      <ErrorAddressForm error={this.state.errors[error]} />);

    return (
      <form>
        {this.props.user.loading && <Loading />}
        <div className="row" styleName="forms-row">
          <div className="col-md-6 col-sm-6 col-xs-12">
            <Field
              component={RenderFieldAddresForm}
              name="cep"
              type="text"
              label="Digite o CEP*"
              normalize={normalizeCEP}
              validate={required}
              onBlur={() => this.isFromSaoPaulo()}
              characterLimit="9"
            />
          </div>
          <div className="col-md-6 col-sm-6 col-xs-12">
            <a styleName="support-link" rel="noopener noreferrer" target="_blank" href="http://www.buscacep.correios.com.br/sistemas/buscacep/">Não sabe seu cep?</a>
          </div>
        </div>
        <div className="row" styleName="forms-row">
          <div className="col-md-6 col-sm-12 col-xs-12">
            <Field
              component={RenderFieldAddresForm} name="address" type="text"
              label="Endereço*"
              validate={required}
            />
          </div>
          <div className="col-md-3 col-sm-6 col-xs-12">
            <Field
              component={RenderFieldAddresForm} name="number" type="number"
              label="Número*"
              validate={required}
            />
          </div>
          <div className="col-md-3 col-sm-6 col-xs-12">
            <Field
              component={RenderFieldAddresForm} name="complement" type="text"
              label="Complemento"
              validate={required}
            />
          </div>
        </div>
        <div className="row" styleName="forms-row">
          <div className="col-md-4 col-sm-4 col-xs-12">
            <Field
              component={RenderFieldAddresForm} name="neighborhood" type="text"
              label="Bairro"
            />
          </div>
          <div className="col-md-4 col-sm-4 col-xs-12">
            <Field
              component={RenderFieldAddresForm} name="city" type="text"
              label="Cidade*"
              validate={required}
            />
          </div>
          <div className="col-md-4 col-sm-4 col-xs-12">
            <FalseField
              defaultValue="São Paulo"
              disabled
            />
          </div>
        </div>
        <div className="row" styleName="forms-row">
          <div className="col-md-4 col-sm-4 col-xs-12">
            <Field
              component={RenderFieldAddresForm} name="telephone" type="text"
              label="Telefone*"
              normalize={normalizePhone} validate={required}
              characterLimit="13"
            />
          </div>

        </div>
        {showErrors && <span styleName="errors">{showErrors}</span>}
        <button
          styleName="btn-default"
          type="button"
          onClick={this.validateForm}
        >
          Continuar
        </button>
      </form>
    );
  }
}

AddressForm.propTypes = Object.assign({
  handleSubmit: PropTypes.func.isRequired,
  addToCart: PropTypes.func.isRequired,
  fetchSaveAddressForUser: PropTypes.func.isRequired,
  getAddressByZip: PropTypes.func.isRequired,
  form: PropTypes.shape({
    cepForm: PropTypes.shape({
      values: PropTypes.shape({
        cep: PropTypes.string,
      }),
    }),
    addressForm: PropTypes.shape({
      values: PropTypes.shape({
        cep: PropTypes.string,
        name: PropTypes.string,
        address: PropTypes.string,
        number: PropTypes.string,
        complement: PropTypes.string,
        city: PropTypes.string,
        uf: PropTypes.string,
        country: PropTypes.string,
      }),
    }),
  }),
  user: PropTypes.shape({
    token: PropTypes.string,
    address: PropTypes.shape({
      postcode: PropTypes.string,
      neighborhood: PropTypes.string,
      number: PropTypes.string,
      city: PropTypes.string,
      street_complement: PropTypes.string,
      street: PropTypes.string,
      telephone: PropTypes.string,
    }),
  }).isRequired,
  cart: PropTypes.shape({
    id: PropTypes.node,
  }),
  logout: PropTypes.func.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
}, propTypes);

AddressForm.defaultProps = {
  showErrors: null,
  form: {
    cepForm: {
      values: {
        cep: '',
      },
    },
    addressForm: {
      values: {
        cep: '',
        name: '',
        address: '',
        number: '',
        complement: '',
        city: '',
        uf: '',
        country: '',
      },
    },
  },
  cart: null,
};

function mapStateToProps(state) {
  return state;
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    fetchSaveAddressForUser,
    getAddressByZip,
    addToCart,
    logout,
  }, dispatch);
}

const enhance = compose(
  reduxForm({ form: 'addressForm' }),
  connect(mapStateToProps, mapDispatchToProps),
);

export default enhance(AddressForm);
