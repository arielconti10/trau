import React, { Component, PropTypes } from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { connect } from 'react-redux';
import { fetchProduct, wipeProduct, addToCart, toggleFiltersView, fetchMethodDeliveryProduct, setFilterProductVariations } from 'Actions';
import { bindActionCreators } from 'redux';
import ProductDetail from 'Components/ProductDetail';
import Loading from 'Components/Loading';
import thumbor from 'Helpers/thumbor';
import { shareImageFallback } from 'Config/Constants';
import Helmet from 'react-helmet';
import Modal from 'Components/Modal';


class ProductView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      productId: null,
      showModal: false,
    };
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    this.handleBuyClick = this.handleBuyClick.bind(this);
    this.handleClickChangeOption = this.handleClickChangeOption.bind(this);
    props.fetchProduct(props.shop.slug, props.match.params.catalogId);
  }

  componentDidMount() {
    this.props.toggleFiltersView(false);
  }

  componenteWillUnmount() {
    this.props.wipeProduct();
  }

  handleBuyClick() {
    const { cart, product, user } = this.props;
    const id = this.state.productId || this.props.match.params.catalogId;
    if (product.configurableOptions.length > 0 &&
        (id === this.props.match.params.catalogId)) {
      const item = product.configurableOptions[0];
      this.props.addToCart(cart.id, user.id, item.id).then((result) => {
        if (result.payload.status === 400) {
          this.setState({ showModal: true });
        } else {
          const redirectUrl = '/cart';
          this.props.history.push(redirectUrl);
        }
      });
    } else {
      this.props.addToCart(cart.id, user.id, id).then((result) => {
        if (result.payload.status === 400) {
          this.errorMessage = 'Oops! Este produto está fora do nosso estoque';
          this.setState({ showModal: true });
        } else {
          const redirectUrl = '/cart';
          this.props.history.push(redirectUrl);
        }
      });
    }
  }

  handleClickChangeOption(item) {
    this.setState({ productId: item.id }, () => {
      this.props.setFilterProductVariations(item);
    });
  }

  render() {
    const { product } = this.props;
    if (product.loading) {
      return <Loading opaque />;
    }

    const modalStyle = {
      textAlign: 'center',
    };

    const images = product.images.map((image) => {
      const ogImage = thumbor.setImagePath(image || shareImageFallback)
        .resize(300, 200)
        .buildUrl();
      return { property: 'og:image', content: ogImage };
    });
    const itemPropImages = product.images.map((image) => {
      const ogImage = thumbor.setImagePath(image || shareImageFallback)
        .resize(300, 200).buildUrl();
      return { content: ogImage, itemprop: 'image' };
    });

    const metaTags = [
      { name: 'description', content: `${product.title} - ${product.description}` },
      { property: 'og:title', content: `${product.title}` },
      { property: 'og:description', content: `${product.title} - ${product.description}` },
      { property: 'og:image:width', content: 300 },
      { property: 'og:image:height', content: 200 },
      { property: 'og:url', content: window.location.href },
    ];

    return (
      <div>
        <Helmet
          title={product.title}
          meta={metaTags.concat(images, itemPropImages)}
        />
        <ProductDetail
          {...this.props.product}
          onBuyClick={this.handleBuyClick}
          handleClickChangeOption={this.handleClickChangeOption}
          shop={this.props.shop}
        />
        {this.state.showModal === true ?
          <Modal isOpen={this.state.showModal}>
            <p style={modalStyle}>{this.errorMessage}</p>
          </Modal>
          : ''
        }
      </div>
    );
  }
}

ProductView.propTypes = {
  user: PropTypes.shape({
    token: PropTypes.string,
    id: PropTypes.number,
    email: PropTypes.string,
    nome: PropTypes.string,
  }),
  match: PropTypes.shape({
    params: PropTypes.shape({
      catalogId: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  shop: PropTypes.shape({
    slug: PropTypes.string,
    image: PropTypes.string,
    name: PropTypes.string,
    phone: PropTypes.string,
    email: PropTypes.string,
  }),
  product: PropTypes.shape({
    loading: PropTypes.bool.isRequired,
    variationId: PropTypes.node,
    configurableOptions: PropTypes.arrayOf(PropTypes.object),
    error: PropTypes.bool.isRequired,
  }).isRequired,
  cart: PropTypes.shape({
    id: PropTypes.node,
  }).isRequired,
  fetchProduct: PropTypes.func.isRequired,
  wipeProduct: PropTypes.func.isRequired,
  addToCart: PropTypes.func.isRequired,
  setFilterProductVariations: PropTypes.func.isRequired,
  toggleFiltersView: PropTypes.func.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};

ProductView.defaultProps = {
  params: {},
  shop: {},
  user: {},
};

function mapStateToProps({ shop, currentProduct, cart, user }) {
  return {
    product: currentProduct,
    shop,
    cart,
    user,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ fetchProduct,
    wipeProduct,
    addToCart,
    toggleFiltersView,
    fetchMethodDeliveryProduct,
    setFilterProductVariations }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ProductView);
