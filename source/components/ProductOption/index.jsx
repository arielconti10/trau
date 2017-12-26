import React, { Component, PropTypes } from 'react';
import './ProductOption.css';

class ProductOption extends Component {
  componentWillMount() {
  }

  render() {
    const { value, title } = this.props;
    return (
      <div>
        <div styleName="box-option is-interactive quantity">
          {title && <div styleName="box-option-title">{title}</div>}
          <div styleName={`background-option is-color ${title ? 'withHeader' : 'notHeader'}`} data-cor="azul-claro">{value}</div>
          {/*
          <select styleName="box-option-dropdown">
            <option selected value="P">{value}</option>
          </select>
          */}
          <div styleName={`box-option-color-dropdown ${title ? 'visible' : ''}`}>
            <button styleName="box-option-color-item" data-cor="azul-claro">Azul Claro</button>
            <button styleName="box-option-color-item" data-cor="turquesa">Turquesa</button>
            <button styleName="box-option-color-item" data-cor="pink">Rosa</button>
          </div>
        </div>
      </div>
    );
  }
}

ProductOption.propTypes = Object.assign({
  value: PropTypes.node.isRequired,
  title: PropTypes.string,
});

ProductOption.defaultProps = {
  title: '',
};

export default ProductOption;
