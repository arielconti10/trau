import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { fetchCart, toggleFiltersView, setFilterParams,
  removeToCart, updateQuantityProdutoToCart } from 'Actions';
import TitleHeader from 'Components/TitleHeader';
import CartItem from 'Components/CartItem';
import OrderFooter from 'Components/OrderFooter';
import OrderSubTotal from 'Components/OrderSubTotal';
import Loading from 'Components/Loading';
import CheckoutSteps from 'Components/CheckoutSteps';
// import DiscountCoupon from 'Components/DiscountCoupon';
import { withRouter } from 'react-router-dom';
import './Cart.css';

class Cart extends Component {
  constructor(props) {
    super(props);
    this.handleRemoveItem = this.handleRemoveItem.bind(this);
    this.handleClickChangeOption = this.handleClickChangeOption.bind(this);
    this.handleSelectShipping = this.handleSelectShipping.bind(this);
  }
  componentWillMount() {
    if (this.props.cart.id) {
      this.props.fetchCart(this.props.cart.id);
    }
  }

  componentDidMount() {
    this.props.setFilterParams(null);
    this.props.toggleFiltersView(false);
  }

  handleRemoveItem(product) {
    if (product.catalogProductId && this.props.cart.id) {
      this.props.removeToCart(this.props.cart.id, product.catalogProductId);
    }
  }

  handleClickChangeOption(item) {
    this.props.updateQuantityProdutoToCart(
      { quantity: item.id, productId: item.variationId, cartId: this.props.cart.id });
  }

  handleSelectShipping() {
    const { token } = this.props.user;

    if (!token) {
      this.props.history.push('login?url=/shipping/');
      return;
    }
    this.props.history.push('/shipping');
    this.forceUpdate();
  }
  render() {
    const { cart, order, user } = this.props;

    if (!cart || !(cart.products && cart.products.length)) {
      return (
        <section className="container">
          {cart.loading && <Loading />}
          <TitleHeader showBackButton>Meu Carrinho</TitleHeader>
          <div styleName="wrapper-basket">
            <div styleName="icon-basket" />
            <span styleName="title-basket">Sua cesta está vazia</span>
          </div>
        </section>
      );
    }

    const checkoutStep = user.token ? 2 : 1;

    return (
      <section className="container">
        {(cart.loading || order.loading) && <Loading />}
        <TitleHeader showBackButton>Meu Carrinho</TitleHeader>
        <div className="row">
          <CheckoutSteps step={checkoutStep} />
          {cart && cart.products && cart.products.map(product =>
            <CartItem
              key={product.catalogProductId}
              product={product}
              showRemoveButton
              handleClick={this.handleRemoveItem}
              quantityVariations={product.quantityVariations}
              handleClickChangeOption={this.handleClickChangeOption}
            />,
          )}
        </div>
        {/* <DiscountCoupon/> */}
        {cart.products.length && cart.total_price &&
          <div>
            <OrderSubTotal
              amount={cart.total_price}
            />
            <OrderFooter
              amount={cart.total_price} showKeepBuying
              handleSelectShipping={this.handleSelectShipping}
            />
          </div>
        }
      </section>
    );
  }
}

Cart.propTypes = {
  cart: PropTypes.shape({
    id: PropTypes.number,
    installments: PropTypes.array,
    total: PropTypes.number,
    interest: PropTypes.number,
    error: PropTypes.bool,
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
  }).isRequired,
  order: PropTypes.shape({
    error: PropTypes.bool,
    amount: PropTypes.number,
    order: PropTypes.number,
    boleto: PropTypes.shape({
      link: PropTypes.string,
      barCode: PropTypes.string,
      dueDate: PropTypes.string,
    }),
    paymentType: PropTypes.string,
  }).isRequired,
  user: PropTypes.shape({
    token: PropTypes.string,
    id: PropTypes.number,
    email: PropTypes.string,
    nome: PropTypes.string,
  }).isRequired,
  fetchCart: PropTypes.func.isRequired,
  removeToCart: PropTypes.func.isRequired,
  updateQuantityProdutoToCart: PropTypes.func.isRequired,
  setFilterParams: PropTypes.func.isRequired,
  toggleFiltersView: PropTypes.func.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};

Cart.defaultProps = {
  params: {},
};

function mapStateToProps(state) {
  return state;
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    fetchCart,
    removeToCart,
    updateQuantityProdutoToCart,
    toggleFiltersView,
    setFilterParams,
  }, dispatch);
}


export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Cart));
