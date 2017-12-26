import React, { PropTypes } from 'react';
import CurrencyFormat from 'Components/CurrencyFormat';
import './OrderTotal.css';

function OrderTotal({ amount, smallStyle }) {
  const splitAmount = parseFloat(amount) / 10;
  return (
    <div styleName={`wrapper ${smallStyle ? 'small-style' : ''}`}>
      <span styleName="title">Total</span>
      <span styleName="price">
        <span styleName="full-amount"><CurrencyFormat value={amount} /></span><br />
        <span styleName="split-amount">ou em <span>
          10x de <CurrencyFormat value={splitAmount} /></span> sem juros</span>
      </span>
    </div>
  );
}

OrderTotal.propTypes = {
  amount: PropTypes.number.isRequired,
  smallStyle: PropTypes.bool,
};

OrderTotal.defaultProps = {
  smallStyle: false,
};

export default OrderTotal;
