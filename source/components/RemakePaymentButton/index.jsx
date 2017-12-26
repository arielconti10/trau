import React, { Component, PropTypes } from 'react';
import { removeCart, remakePaymentForOrder } from 'Actions';
import { moneyToCents } from 'Helpers/Number';
import { checkout as checkoutConfig } from 'Config/Constants';
import { withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import ActionButton from 'Components/ActionButton';

class RemakePaymentButton extends Component {
  constructor(props) {
    super(props);
    this.handleCheckout = this.handleCheckout.bind(this);
  }

  componentWillMount() {
    const script = document.createElement('script');
    script.src = 'https://assets.pagar.me/checkout/checkout.js';
    script.async = true;
    document.body.appendChild(script);
  }

  handleCheckout() {
    const { name, email, cpf, address } = this.props.user;
    const { id } = this.props.shop;
    const { myOrder } = this.props;

    const checkout = new window.PagarMeCheckout.Checkout({
      encryption_key: checkoutConfig.encryptionKey,
      success: (data) => {
        this.props.remakePaymentForOrder(id, myOrder.id, data.token);
      },
    });

    const phone = address.telephone.slice(2);

    const userAddress = {
      customerAddressStreet: address.street,
      customerAddressNeighborhood: address.neighborhood,
      customerAddressZipcode: address.postcode,
      customerAddressStreetNumber: address.number,
      customerAddressComplementary: address.street_complement || '',
      customerAddressState: 'SP',
      customerAddressCity: address.city,
      customerPhoneDdd: '011',
      customerPhoneNumber: phone.trim(),
    };

    let amout = 0;
    amout = moneyToCents(parseFloat(myOrder.reseller_total));

    const dataCheckout = {
      amount: amout,
      maxInstallments: 10,
      interestRate: 0,
      customerName: name,
      customerDocumentNumber: cpf.replace(/[^\d]+/g, ''),
      customerEmail: email,
    };
    const data = Object.assign(dataCheckout, userAddress);
    checkout.open(Object.assign(checkoutConfig, data));
  }
  render() {
    return (
      <div>
        <ActionButton
          size="large"
          fullwidth
          remakePayments={this.props.remakePaymentsButton}
          onClick={this.handleCheckout}
        >
          {this.props.children}
        </ActionButton>
      </div>
    );
  }
}

RemakePaymentButton.propTypes = {
  children: PropTypes.node,
  shop: PropTypes.shape({
    id: PropTypes.number,
    slug: PropTypes.string,
    name: PropTypes.string,
  }).isRequired,
  user: PropTypes.shape({
    token: PropTypes.string,
    id: PropTypes.number,
    name: PropTypes.string,
    cpf: PropTypes.string,
    email: PropTypes.string,
    address: PropTypes.shape({
      postcode: PropTypes.string,
      neighborhood: PropTypes.string,
      number: PropTypes.string,
      city: PropTypes.string,
      street_complement: PropTypes.string,
      street: PropTypes.string,
      telephone: PropTypes.string,
    }),
  }).isRequired,
  remakePaymentForOrder: PropTypes.func.isRequired,
  remakePaymentsButton: PropTypes.bool,
  myOrder: PropTypes.shape(),
};

RemakePaymentButton.defaultProps = {
  children: '',
  typeSale: '',
  params: {},
  cart: null,
  myOrder: null,
  remakePaymentOrder: null,
  deliveryPrice: null,
  removeCartAndCreateCart: false,
  remakePaymentsButton: false,
};

function mapStateToProps(state) {
  return state;
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    remakePaymentForOrder,
    removeCart,
  }, dispatch);
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(RemakePaymentButton));
