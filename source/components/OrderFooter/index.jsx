import React, { PropTypes } from 'react';
import OrderTotal from 'Components/OrderTotal';
// import OrderSubTotal from 'Components/OrderSubTotal';<OrderSubTotal amount={amount} />
// import DiscountCupom from 'Components/DiscountCupom';<DiscountCupom />
import KeepBuying from 'Components/KeepBuying';
import ActionButton from 'Components/ActionButton';
import './OrderFooter.css';

function OrderFooter(
  { actionText, paymentType, showKeepBuying, amount, handleSelectShipping }) {
  return (
    <div className="row">
      <div className="col-md-12">
        <OrderTotal amount={amount} />
        <div styleName="cart-footer">
          <div styleName="finish-wrapper">
            {!!paymentType &&
              <span styleName="payment-type">
                <b styleName="payment-type-title">Forma de Pagamento:</b> Boleto
              </span>}
            <div styleName="finish-button">
              <ActionButton
                size="large"
                fullwidth
                onClick={handleSelectShipping}
              >
                {actionText}
              </ActionButton>
            </div>
          </div>
          {showKeepBuying &&
            <div styleName="keep-buying">
              <KeepBuying />
            </div>}
        </div>
      </div>
    </div>
  );
}

OrderFooter.propTypes = {
  actionText: PropTypes.string,
  paymentType: PropTypes.string,
  showKeepBuying: PropTypes.bool,
  amount: PropTypes.number.isRequired,
  handleSelectShipping: PropTypes.func.isRequired,
};
OrderFooter.defaultProps = {
  actionText: 'Finalizar Compra',
  paymentType: '',
  showKeepBuying: false,
};

export default OrderFooter;
