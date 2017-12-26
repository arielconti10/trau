import React, { Component, PropTypes } from 'react';
import { createOrder, createOrderPayment, removeCart, remakePaymentForOrder, logout } from 'Actions';
import { moneyToCents } from 'Helpers/Number';
import { checkout as checkoutConfig } from 'Config/Constants';
import { withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import ActionButton from 'Components/ActionButton';
import Modal from 'Components/Modal';
import ModalInvoice from 'Containers/Shipping/ModalInvoice';
import ModalSuccess from 'Components/Cart/ModalSuccess';
import ModalError from 'Components/Cart/ModalError';
import ModalStockError from 'Components/Cart//ModalStockError';

class CheckoutButton extends Component {
  constructor(props) {
    super(props);
    this.handleCheckout = this.handleCheckout.bind(this);

    this.state = {
      creditCard: false,
      boleto: false,
      error: false,
      showModal: false,
      outOfStock: false,
    };
  }

  componentWillMount() {
    const script = document.createElement('script');
    script.src = 'https://assets.pagar.me/checkout/checkout.js';
    script.async = true;
    document.body.appendChild(script);
  }

  showModal(type) {
    this.state = {
      creditCard: false,
      boleto: false,
      error: false,
      showModal: false,
      outOfStock: false,
    };
    switch (type) {
      case 'creditCard':
        this.setState({ creditCard: true });
        break;
      case 'boleto':
        this.setState({ boleto: true });
        break;
      case 'error':
        this.setState({ error: true });
        break;
      case 'outOfStock':
        this.setState({ outOfStock: true });
        break;
      default:
        this.state = {
          creditCard: false,
          boleto: false,
          error: false,
          showModal: false,
          outOfStock: false,
        };
        break;
    }
    this.setState({ showModal: true });
    this.forceUpdate();
  }

  handleCheckout() {
    const { token, name, email, cpf, address } = this.props.user;
    const { id } = this.props.shop;
    const { cart, myOrder, typeSale, deliveryPrice } = this.props;
    let type = '';
    if (typeSale) {
      type = typeSale === 'seller' ? 'BOX' : 'DIRECT';
    }
    if (!token) {
      this.props.history.push('/login?url=/cart/');
      return;
    }
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
      customerPhoneNumber: phone.trim().replace('-', ''),
    };
    let amout = 0;
    if (myOrder && myOrder.reseller_total) {
      amout = moneyToCents(parseFloat(myOrder.reseller_total));
    } else if (deliveryPrice) {
      amout = moneyToCents(parseFloat(cart.total_price) + parseFloat(deliveryPrice));
    } else {
      amout = moneyToCents(parseFloat(cart.total_price));
    }

    const checkout = new window.PagarMeCheckout.Checkout({
      encryption_key: checkoutConfig.encryptionKey,
      success: (data) => {
        if (!myOrder) {
          this.props.createOrderPayment(id, this.props.order.order_id, data.token)
          .then((action) => {
            if (action.payload.status === 401) {
              this.props.logout().then(() => {
                this.props.removeCart().then(() => {
                  this.props.history.push('/login');
                });
              });
              return;
            }
            if (this.props.cart.error) {
              this.props.history.push('/erro');
              return;
            }
            const { error, payment } = this.props.order;
            if (error) {
              this.showModal('error');
            } else if (payment && payment.type.toLowerCase() === 'boleto') {
              this.showModal('boleto');
            } else {
              this.showModal('creditCard');
            }
            this.props.removeCart();
          });
        } else {
          this.props.remakePaymentForOrder(id, myOrder.id, data.token).then((action) => {
            if (action.payload.status === 401) {
              this.props.logout().then(() => {
                this.props.history.push('/login');
              });
              return;
            }
            const { error, payment } = this.props.order;
            if (error) {
              this.showModal('error');
            } else if (payment && payment.type.toLowerCase() === 'boleto') {
              this.showModal('boleto');
            } else {
              this.showModal('creditCard');
            }
          });
        }
      },
    });

    const dataCheckout = {
      amount: amout,
      maxInstallments: 10,
      interestRate: 0,
      customerName: name,
      customerDocumentNumber: cpf.replace(/[^\d]+/g, ''),
      customerEmail: email,
    };
    const data = Object.assign(dataCheckout, userAddress);

    if (myOrder && myOrder.id) {
      checkout.open(Object.assign(checkoutConfig, data));
    } else if (this.props.order.order_id) {
      checkout.open(Object.assign(checkoutConfig, data));
    } else {
      this.props.createOrder(id, cart.id, type).then((action) => {
        if (action.payload.status === 401) {
          this.props.logout().then(() => {
            this.props.history.push('/login');
          });
        } else if (!this.props.order.error) {
          checkout.open(Object.assign(checkoutConfig, data));
          this.props.removeCart();
        } else {
          if (this.props.order.responseMessage && this.props.order.responseMessage === 'OUT_OF_STOCK') {
            return this.showModal('outOfStock');
          }
          this.props.removeCart();
          this.props.history.push('/account');
        }
        return null;
      });
    }
  }
  render() {
    const to = '/account';
    return (
      <div>
        {this.state.showModal &&
        <Modal
          isOpen={this.state.showModal}
          slug={this.props.shop.slug}
          goTo={to}
          removeCartAndCreateCart={this.props.removeCartAndCreateCart}
        >
          {this.state.creditCard && <ModalSuccess
            email={this.props.user.email}
            storeName={this.props.shop.name}
            order={this.props.order.increment_id}
            deliveryType={this.props.order.type}
          />}
          {this.state.error && <ModalError />}
          {this.state.boleto && <ModalInvoice
            email={this.props.user.email}
            storeName={this.props.shop.name}
            order={this.props.order}
            deliveryType={this.props.order.type}
          />}
          {this.state.outOfStock && <ModalStockError />}
        </Modal>}
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

CheckoutButton.propTypes = {
  typeSale: PropTypes.string.isRequired,
  deliveryPrice: PropTypes.node,
  children: PropTypes.node,
  cart: PropTypes.shape({
    id: PropTypes.number,
    installments: PropTypes.array,
    total_price: PropTypes.number,
    interest: PropTypes.number,
    error: PropTypes.stringimages,
    loading: PropTypes.bool,
    products: PropTypes.arrayOf(PropTypes.shape({
      quantity: PropTypes.number,
      variationId: PropTypes.number,
      brand: PropTypes.string,
      title: PropTypes.string,
      price: PropTypes.node,
      axes: PropTypes.arrayOf(PropTypes.shape({
        desc: PropTypes.node,
        id: PropTypes.node,
        hex: PropTypes.node,
      })),
      images: PropTypes.string,
    })),
  }),
  order: PropTypes.shape({
    error: PropTypes.bool,
    amount: PropTypes.number,
    order: PropTypes.number,
    order_id: PropTypes.number,
    increment_id: PropTypes.number,
    responseMessage: PropTypes.string,
    boleto: PropTypes.shape({
      link: PropTypes.string,
      barCode: PropTypes.string,
      dueDate: PropTypes.string,
    }),
    paymentType: PropTypes.string,
    payment: PropTypes.shape({
      amount: PropTypes.string,
      boleto_bar_code: PropTypes.string,
      boleto_url: PropTypes.string,
      type: PropTypes.string,
    }),
    type: PropTypes.string,
  }).isRequired,
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
  createOrder: PropTypes.func.isRequired,
  removeCart: PropTypes.func.isRequired,
  remakePaymentForOrder: PropTypes.func.isRequired,
  createOrderPayment: PropTypes.func.isRequired,
  removeCartAndCreateCart: PropTypes.bool,
  remakePaymentsButton: PropTypes.bool,
  myOrder: PropTypes.shape(),
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  logout: PropTypes.func.isRequired,
};

CheckoutButton.defaultProps = {
  children: '',
  typeSale: '',
  params: {},
  cart: null,
  myOrder: null,
  deliveryPrice: null,
  removeCartAndCreateCart: false,
  remakePaymentsButton: false,
};

function mapStateToProps(state) {
  return state;
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    createOrder,
    createOrderPayment,
    remakePaymentForOrder,
    removeCart,
    logout,
  }, dispatch);
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(CheckoutButton));
