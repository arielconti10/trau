import React, { PropTypes } from 'react';
import CurrencyFormat from 'Components/CurrencyFormat';
import { Field, reduxForm } from 'redux-form';
import Loading from '../../assets/imgs/little-loading.svg';
import './DiscountCoupon.css';

const DiscountCoupon = ({ loading, invalidCoupon }) => (
  <div styleName="wrapper">
    <span styleName="question">Ganhou desconto?</span>
    <div styleName="coupon-form">
      <span styleName="hint">Insira o cupom aqui</span>
      <Field
        styleName="discount-input"
        component="input"
        name="discount"
        type="text"
        placeholder="Cupom"
      />
      {loading &&
        <img src={Loading} styleName="coupon-feedback" alt="loading CEP" />
      }
      {!loading &&
        <button
          styleName="coupon-call-to-action"
          onClick={() => { DiscountCoupon.setProps({ loading: true }); }}
        >
          Utilizar
        </button>
      }
      {invalidCoupon &&
        <span styleName="coupon-error-message">Cupom inválido!</span>
      }
    </div>
    {this.props.couponValue > 0 &&
      <span styleName="discount-value">- <CurrencyFormat value={this.props.couponValue} /></span>
    }
  </div>
);

DiscountCoupon.propTypes = {
  loading: PropTypes.bool,
  invalidCoupon: PropTypes.bool,
};

DiscountCoupon.defaultProps = {
  loading: false,
  invalidCoupon: false,
};

export default reduxForm({ form: 'discountForm' })(DiscountCoupon);
