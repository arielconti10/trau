import React, { PropTypes } from 'react';

function CurrencyFormat({ value }) {
  const formater = new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 2,
  });
  return (<span>R$ {formater.format(value)}</span>);
}

CurrencyFormat.propTypes = {
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]).isRequired,
};

export default CurrencyFormat;
