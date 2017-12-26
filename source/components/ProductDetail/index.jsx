import React, { PropTypes, Component } from 'react';
import { compose } from 'recompose';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { fetchMethodDeliveryProduct } from 'Actions';
import Price from 'Components/Price';
import ProductSlider from 'Components/ProductSlider';
import TitleHeader from 'Components/TitleHeader';
import ActionButton from 'Components/ActionButton';
import SelectDefault from 'Components/ProductOption/SelectDefault';
import DeliveryType from 'Components/DeliveryType';
import './ProductDetail.css';
import placeholder from '../../assets/imgs/placeholder.jpg';

class ProductDetail extends Component {
  constructor(props) {
    super(props);
    this.handleSubmitCep = this.handleSubmitCep.bind(this);
    this.handleChangeText = this.handleChangeText.bind(this);
    this.state = {
      luaShipping: null,
      loadingCep: false,
      showCepButton: true,
      errorMessage: null,
    };
  }

  handleSubmitCep(e) {
    e.preventDefault();
    this.setState({ loadingCep: true });
    this.props.fetchMethodDeliveryProduct(this.props.form.cepForm.values.cep,
      this.props.catalogProductId)
      .then((data) => {
        if (data.payload.price) {
          this.setState({ luaShipping: data.payload.price, loadingCep: false });
        } else {
          this.setState({ loadingCep: false, errorMessage: data.payload.error });
        }
      });
  }

  handleChangeText(event) {
    if (event.target.value.length < 8) {
      this.setState({ luaShipping: null });
    }
  }

  render() {
    const {
      title,
      brand,
      description,
      info,
      price,
      priceFrom,
      images,
      onBuyClick,
      shop,
      handleClickChangeOption,
      configurableOptions,
      variationsTitle,
      stockState,
    } = this.props;
    const image = images && images.length ? images : [placeholder];
    const value = null;
    const disabled = !stockState;
    return (
      <div className="container" styleName="wrapper">
        <span styleName="showBackButtonWrapper">
          <TitleHeader showBackButton />
        </span>
        <article className="row">
          <div className="col-md-6" styleName="product-slider">
            <ProductSlider images={image} />
          </div>
          <div className="col-md-6">
            <h1 styleName="title">{title}</h1>
            <span styleName="brand">{brand}</span>

            <div className="row">
              <div className="col-lg-12">
                {configurableOptions.length > 0 &&
                  <SelectDefault
                    value={value} variations={configurableOptions} type={variationsTitle}
                    handleClickChangeOption={handleClickChangeOption}
                  />
                }
              </div>
            </div>
            <div className="row">
              <div className="col-lg-12" styleName="price-wrapper">
                <Price size="large" priceFrom={priceFrom} price={price} />
              </div>
            </div>
            {shop.flPersonalSale &&
              <div>
                <DeliveryType
                  title={'Retirar com'}
                  type="seller"
                  name="seller"
                  sellerName={shop.name}
                  sellerDelivery={'De 15 à 25 dias úteis'}
                  sellerShipping={'0'}
                />
                <hr styleName="types-div" />
              </div>
            }
            {shop.flDirectSale &&
              <DeliveryType
                title={'Entregar no meu endereço'}
                type="lua"
                name="lua"
                handleChangeText={this.handleChangeText}
                sellerShipping={this.state.luaShipping}
                sellerDelivery={'Até 10 dias úteis'}
                hasCepComponent
                handleSubmit={this.handleSubmitCep}
                loading={this.state.loadingCep}
                cepButton={this.state.showCepButton}
                errorMessage={this.state.errorMessage}
              />
            }
            <div className="container-fluid" styleName="description-grid">
              <div className="row">
                <div className="row">
                  <div
                    styleName="description-grid-column buy-btn"
                    className="col-md-5 col-sm-6 col-xs-12"
                  >
                    <ActionButton
                      size="large"
                      fullwidth
                      onClick={onBuyClick}
                      disabled={disabled}
                    >Comprar</ActionButton>
                  </div>
                  {disabled && <div styleName="info-text-error">
                    Produto fora de estoque.
                  </div>}
                </div>
                <div styleName="description-grid-column">
                  <span styleName="info">
                    <h2 styleName="info-title">Descrição</h2>
                    <div styleName="info-text">
                      {description}
                    </div>
                  </span>
                </div>
                <div styleName="description-grid-column">
                  <span styleName="info">
                    <h2 styleName="info-title">Mais Informações</h2>
                    <div styleName="info-text">
                      {info}
                    </div>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </article>
      </div>
    );
  }
}

ProductDetail.propTypes = {
  title: PropTypes.string,
  brand: PropTypes.string,
  description: PropTypes.string,
  variationsTitle: PropTypes.string,
  info: PropTypes.string,
  stockState: PropTypes.number,
  price: PropTypes.number,
  priceFrom: PropTypes.number,
  catalogProductId: PropTypes.number,
  configurableOptions: PropTypes.arrayOf(PropTypes.object),
  images: PropTypes.node,
  onBuyClick: PropTypes.func.isRequired,
  fetchMethodDeliveryProduct: PropTypes.func.isRequired,
  handleClickChangeOption: PropTypes.func.isRequired,
  form: PropTypes.shape({
    cepForm: PropTypes.shape({
      values: PropTypes.shape({
        cep: PropTypes.string,
      }),
    }),
  }),
  shop: PropTypes.shape({
    flDirectSale: PropTypes.boolean,
    flPersonalSale: PropTypes.boolean,
  }).isRequired,
};

ProductDetail.defaultProps = {
  title: '',
  brand: '',
  description: '',
  info: '',
  colorSelect: '',
  variationsTitle: '',
  price: 0,
  stockState: 0,
  catalogProductId: 0,
  priceFrom: 0,
  images: [],
  colorVariations: [],
  otherVariations: [],
  configurableOptions: [],
  descBasicVariation: {},
  form: {
    cepForm: {
      values: {
        cep: '',
      },
    },
  },
};


function mapStateToProps(state) {
  return state;
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    fetchMethodDeliveryProduct,
  }, dispatch);
}

const enhance = compose(
  connect(mapStateToProps, mapDispatchToProps),
);

export default enhance(ProductDetail);
