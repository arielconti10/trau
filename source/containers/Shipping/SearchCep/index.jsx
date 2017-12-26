import React, { Component, PropTypes } from 'react';
import { Field, reduxForm } from 'redux-form';
import Loading from '../../../assets/imgs/little-loading.svg';
import './SearchCep.css';

const maxLength = num => (value, previousValue) =>
  (value.length <= num ? value : previousValue);

class SearchCep extends Component {
  constructor(props) {
    super(props);
    this.validateCep = this.validateCep.bind(this);

    this.state = {
      hasCep: false,
      luaShipping: true,
    };
  }

  validateCep(value) {
    if (value && value.length === 8) {
      this.setState({
        hasCep: true,
      });
    } else {
      this.setState({
        hasCep: false,
        luaShipping: null,
      });
    }
  }

  render() {
    const {
      handleSubmit,
      loading,
      showForm,
    } = this.props;

    return (
      <div styleName="wrapper">
        {showForm &&
          <form onSubmit={handleSubmit}>
            {!loading &&
              <span>
                <Field
                  styleName="input"
                  component="input"
                  name="cep"
                  type="number"
                  placeholder="Digite o CEP"
                  normalize={maxLength(8)}
                  validate={[this.validateCep]}
                />
                <button styleName="bt-calc">Calcular</button>
              </span>
            }
            {loading &&
              <img src={Loading} alt="loading CEP" />
            }
          </form>
        }
      </div>
    );
  }
}

SearchCep.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  showForm: PropTypes.bool.isRequired,
};

export default reduxForm({ form: 'cepForm' })(SearchCep);
