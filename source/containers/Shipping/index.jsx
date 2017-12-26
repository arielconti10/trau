import React, { Component, PropTypes } from 'react';
import { compose } from 'recompose';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { fetchMethodDeliveryCart, removeCart, addToCart, resetOrderState } from 'Actions';
import CheckoutSteps from 'Components/CheckoutSteps';
import { reduxForm } from 'redux-form';
import AddressForm from 'Components/AddressForm';
import DeliveryType from 'Components/DeliveryType';
import { flatString } from 'Helpers/FlatString';
import Modal from 'Components/Modal';
import ModalShopReview from './ModalShopReview';
import './Shipping.css';

class Shipping extends Component {
  constructor(props) {
    super(props);
    if (!this.props.cart.id) {
      this.props.history.push('/account');
    }
    this.selectedOption = this.selectedOption.bind(this);
    this.handleSubmitCep = this.handleSubmitCep.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleStateChange = this.handleStateChange.bind(this);

    this.state = {
      loading: false,
      selected: null,
      showFormWrapper: false,
      showDeliveryOpts: false,
      loadingCep: false,
      checkoutModal: false,
      checkAddress: false,
      isOpen: false,
      isDifferentAddress: false,
      cart: this.props.cart,
      delivery: {},
    };
  }

  componentWillReceiveProps() {
    if (this.props.shop.city && this.props.user.address && this.props.user.address.city &&
      (flatString(this.props.shop.city) !== flatString(this.props.user.address.city))) {
      this.setState({ isDifferentAddress: true });
    }
  }

  selectedOption(name) {
    this.setState({
      selected: name,
    });
  }

  showFormWrapper(show) {
    this.setState({ showFormWrapper: show });
  }

  handleSubmitCep(e) {
    e.preventDefault();
    this.props.fetchMethodDeliveryCart(this.props.form.cepForm.values.cep, this.props.cart.id);
  }

  handleSubmit() {
    const cep = this.props.form.addressForm.values.cep;
    this.props.fetchMethodDeliveryCart(cep.replace('-', ''), this.props.cart.id)
      .then((data) => {
        this.setState({
          showFormWrapper: true,
          checkAddress: true,
          delivery: data.payload,
        });
      });
  }

  handleStateChange() {
    const changeState = !this.state.isOpen;
    if (this.props.order.order_id) {
      this.props.removeCart();
      this.props.resetOrderState();
      this.props.addToCart(null, this.props.user.id);
      this.props.history.push('/account');
    }
    this.setState({ isOpen: changeState });
  }

  render() {
    const { shop, user, order } = this.props;
    const { isDifferentAddress, cart, delivery } = this.state;
    const isMobile = window.innerWidth < 768;
    const customModalStyle = {
      maxWidth: '630px',
      transform: 'translate(-50%, -50%)',
      top: '50%',
      position: 'absolute',
      left: '50%',
      marginTop: '0',
      marginBottom: '20px',
    };

    return (
      <div className="container" styleName="container">
        {this.state.isOpen && <Modal
          isOpen={this.state.isOpen}
          hideCloseDefault
          isSmall={false}
          removeCartAndCreateCart
          contentCustom={!isMobile ? customModalStyle : { maxWidth: 'calc(100vw - 40px)' }}
          onRequestClose={this.handleStateChange}
          loading={order.loading}
        >
          <ModalShopReview
            type={this.state.selected}
            cart={cart}
            delivery={delivery}
            shop={shop}
            user={user}
            order={order}
            handleStateChange={this.handleStateChange}
          />
        </Modal>}
        <CheckoutSteps step={3} />
        {!this.state.showFormWrapper &&
          <div styleName="cep-wrapper">
            <h3 styleName="title">
              Defina o seu endereço.
            </h3>
            <div styleName="wrapper-form" >
              <AddressForm handleSubmit={this.handleSubmit} history={this.props.history} />
            </div>
            {delivery.error !== false &&
              <div styleName="warning-cep">
                {delivery.error}
              </div>
            }
          </div>
        }
        {this.state.showFormWrapper &&
          <div>
            <div styleName="cep-wrapper">
              <h3 styleName="title">
                Defina o tipo de entrega
              </h3>
            </div>
            <div>
              <div styleName="wrapper">
                {shop.flPersonalSale &&
                  <div>
                    <DeliveryType
                      title={'Retirar com'}
                      type="seller"
                      name="seller"
                      sellerName={shop.name}
                      sellerDelivery={'De 15 à 25 dias úteis'}
                      sellerShipping={'0'}
                      isCheckStyle
                      onClick={(option) => {
                        this.selectedOption(option);
                        this.showFormWrapper(true);
                      }}
                      selected={this.state.selected}
                    />
                    <p styleName="warn-text">
                      {isDifferentAddress &&
                        <strong styleName="attention-message">
                          ATENÇÃO: Você optou por retirar o produto com um
                          revendedor que não reside na mesma cidade que você.
                        </strong>
                      }
                      Um email com os contatos do revendedor será enviado
                      para você ao finalizar a compra.
                      <br />
                      Você será notificado quando os produtos forem entregues ao revendor.
                    </p>
                  </div>
                }
                {shop.flDirectSale &&
                  <DeliveryType
                    title={'Entregar no meu endereço'}
                    type="lua"
                    name="lua"
                    sellerShipping={delivery.price}
                    sellerDelivery={'Até 10 dias úteis'}
                    isCheckStyle
                    onClick={(option) => {
                      this.selectedOption(option);
                      this.showFormWrapper(true);
                    }}
                    selected={this.state.selected}
                  />
                }
                {delivery.error !== false &&
                  <div styleName="warning-cep">
                    {delivery.error}
                  </div>
                }
              </div>
              {this.state.selected &&
              <button
                styleName="btn-default"
                disabled={!this.state.selected}
                onClick={this.handleStateChange}
              >
                Continuar
              </button>}
            </div>
          </div>
        }
      </div>
    );
  }
}


Shipping.propTypes = {
  removeCart: PropTypes.func.isRequired,
  addToCart: PropTypes.func.isRequired,
  resetOrderState: PropTypes.func.isRequired,
  fetchMethodDeliveryCart: PropTypes.func.isRequired,
  cart: PropTypes.shape({
    id: PropTypes.number,
    installments: PropTypes.array,
    total: PropTypes.number,
    interest: PropTypes.number,
    loading: PropTypes.bool,
    delivery: PropTypes.shape({
      price: PropTypes.number,
    }),
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
  }).isRequired,
  form: PropTypes.shape({
    cepForm: PropTypes.shape({
      values: PropTypes.shape({
        cep: PropTypes.string,
      }),
    }),
    addressForm: PropTypes.shape({
      values: PropTypes.shape({
        cep: PropTypes.string,
        name: PropTypes.string,
        address: PropTypes.string,
        number: PropTypes.string,
        complement: PropTypes.string,
        city: PropTypes.string,
        uf: PropTypes.string,
        country: PropTypes.string,
      }),
    }),
  }),
  shop: PropTypes.shape({
    slug: PropTypes.string,
    image: PropTypes.string,
    name: PropTypes.string,
    phone: PropTypes.string,
    email: PropTypes.string,
    flDirectSale: PropTypes.boolean,
    flPersonalSale: PropTypes.boolean,
    city: PropTypes.string,
  }).isRequired,
  order: PropTypes.shape({
    error: PropTypes.bool,
    amount: PropTypes.number,
    order_id: PropTypes.number,
    order: PropTypes.number,
    boleto: PropTypes.shape({
      link: PropTypes.string,
      barCode: PropTypes.string,
      dueDate: PropTypes.string,
    }),
    paymentType: PropTypes.string,
  }).isRequired,
  user: PropTypes.shape({
    address: PropTypes.shape({
      city: PropTypes.string,
    }),
    token: PropTypes.string,
    id: PropTypes.number,
    email: PropTypes.string,
    nome: PropTypes.string,
  }).isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};

Shipping.defaultProps = {
  params: {},
  form: {
    cepForm: {
      values: {
        cep: '',
      },
    },
    addressForm: {
      values: {
        cep: '',
        name: '',
        address: '',
        number: '',
        complement: '',
        city: '',
        uf: '',
        country: '',
      },
    },
  },
};

function mapStateToProps(state) {
  return state;
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    fetchMethodDeliveryCart,
    removeCart,
    addToCart,
    resetOrderState,
  }, dispatch);
}

const enhance = compose(
  reduxForm({ form: 'shippingForm' }),
  connect(mapStateToProps, mapDispatchToProps),
);

export default enhance(Shipping);
