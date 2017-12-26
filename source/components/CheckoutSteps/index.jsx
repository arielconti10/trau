import React, { PropTypes } from 'react';
import './CheckoutSteps.css';

function CheckoutSteps({
  step,
}) {
  return (
    <div>
      <ul styleName="steps">
        <li styleName={`step icon-cart ${step >= 1 ? 'active' : ''}`}>
          <span styleName="text-wrapper"><span>Carrinho</span></span>
        </li>
        <li styleName={`step icon-identification ${step >= 2 ? 'active' : ''}`}>
          <span styleName="text-wrapper"><span>Identificação</span></span>
        </li>
        <li styleName={`step icon-delivery ${step >= 3 ? 'active' : ''}`}>
          <span styleName="text-wrapper"><span>Entrega</span></span>
        </li>
        <li styleName={`step icon-payment ${step >= 4 ? 'active' : ''}`}>
          <span styleName="text-wrapper"><span>Pagamento</span></span>
        </li>
      </ul>
    </div>
  );
}

CheckoutSteps.propTypes = {
  step: PropTypes.number.isRequired,
};

export default CheckoutSteps;
