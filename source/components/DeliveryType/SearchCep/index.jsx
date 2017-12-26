import React, { Component, PropTypes } from 'react';
import { Field, reduxForm } from 'redux-form';
import CurrencyFormat from 'Components/CurrencyFormat';
import errors from 'Helpers/Errors';
import { normalizeCEP } from 'Helpers/Normalize';
import Loading from '../../../assets/imgs/little-loading.svg';
import './SearchCep.css';

class SearchCep extends Component {
  constructor(props) {
    super(props);
    this.validateCep = this.validateCep.bind(this);
    this.state = {
      hasCep: false,
      luaShipping: true,
      errorMessage: null,
    };
  }

  validateCep(value) {
    const zipcodeRegexp = /^[01][0-9]{7}$/gm;
    if (value) {
      const cleanValue = value.replace(/[^\d]/g, '');
      if (zipcodeRegexp.test(cleanValue)) {
        this.setState({
          hasCep: true,
          isPaulista: null,
        });
      } else if (!zipcodeRegexp.test(cleanValue) && cleanValue.length === 8) {
        this.setState({
          hasCep: false,
          luaShipping: null,
          isPaulista: errors('zipcode_not_from_sao_paulo'),
        });
      }
    } else {
      this.setState({
        hasCep: false,
        isPaulista: null,
        luaShipping: null,
      });
    }
  }

  render() {
    const {
      loading,
      button,
      value,
      handleSubmit,
    } = this.props;

    const {
      hasCep,
    } = this.state;

    return (
      <form styleName="form-cep" onSubmit={handleSubmit}>
        <Field
          styleName="input input-cep"
          component="input"
          name="cep"
          placeholder="Digite o CEP"
          type="text"
          normalize={normalizeCEP}
          validate={[this.validateCep]}
          onChange={this.props.onChange}
        />
        {!value &&
          !loading &&
          hasCep &&
          <button styleName="bt-calc">Calcular</button>
        }
        {loading &&
          <img src={Loading} alt="loading CEP" />
        }
        {value
          && hasCep
          && !loading &&
          <CurrencyFormat value={value} />
        }
        {this.props.errorMessage &&
          <span styleName="zipcode-error-message">{this.props.errorMessage}</span>
        }
        {this.state.isPaulista &&
          <span styleName="zipcode-error-message">{this.state.isPaulista}</span>
        }
      </form>
    );
  }
}

SearchCep.propTypes = {
  onChange: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  button: PropTypes.bool.isRequired,
  value: PropTypes.number,
  errorMessage: PropTypes.string,
};

SearchCep.defaultProps = {
  value: '',
  errorMessage: null,
};


export default reduxForm({ form: 'cepForm' })(SearchCep);
