import React, { PropTypes } from 'react';
import CurrencyFormat from 'Components/CurrencyFormat';
import './Price.css';

function Price({ priceFrom, price, size }) {
  const from = priceFrom > 0 && priceFrom > price && (
    <span styleName="price-from">
      <del>De <span styleName="price">R$ <CurrencyFormat value={priceFrom} /></span></del>
    </span>
  );
  return (
    <div styleName={`wrapper price-${size}`}>
      {from}
      <span styleName="price-to">por <CurrencyFormat value={price} /></span>
    </div>
  );
}

Price.propTypes = {
  priceFrom: PropTypes.number,
  price: PropTypes.number.isRequired,
  size: PropTypes.string,
};

Price.defaultProps = {
  priceFrom: null,
  size: 'default',
};

export default Price;
