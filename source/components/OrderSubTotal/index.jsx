import React, { PropTypes } from 'react';
import CurrencyFormat from 'Components/CurrencyFormat';
import './OrderSubTotal.css';

function OrderSubTotal({ amount }) {
  return (
    <div styleName="wrapper">
      <span>Sub-total (Produtos)</span>
      <CurrencyFormat value={amount} />
    </div>
  );
}

OrderSubTotal.propTypes = {
  amount: PropTypes.number.isRequired,
};

export default OrderSubTotal;
