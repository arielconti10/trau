import React, { PropTypes } from 'react';
import SelectDefault from 'Components/ProductOption/SelectDefault';
import CurrencyFormat from 'Components/CurrencyFormat';
import { Hiroto } from 'Helpers/Image';
import placeholder from '../../assets/imgs/placeholder.jpg';
import './CartItem.css';

function CartItem({ product, showRemoveButton, handleClick,
  quantityVariations, handleClickChangeOption }) {
  function getQuantityVariations() {
    return Array.from({ length: quantityVariations }, (v, k) => (
      { id: k + 1, description: k + 1 }));
  }
  const images = product.images ? product.images : placeholder;
  return (
    <div styleName="cart-item-wrapper">
      <div styleName="column">
        <div styleName="column-inner-wrapper">
          <div styleName="product-thumbnail-wrapper">
            {showRemoveButton &&
              <button onClick={() => { handleClick(product); }} styleName="close-button" />}
            <div styleName="product-image-wrapper">
              <img styleName="product-image" src={Hiroto(images, { size: '260x260' })} alt={images} />
            </div>
          </div>
          <div styleName="product-info-wrapper">
            <span styleName="column-label">Item</span>
            <span styleName="product-title">{product.title}</span>
            <span styleName="product-brand">{product.brand}</span>
          </div>
        </div>
      </div>
      <div styleName="column">
        <span styleName="column-label">Cor / Tamanho / Quantidade</span>
        <div styleName="column-inner-wrapper">
          {product.variations_name &&
            <span styleName="variation-value">{product.variations_value}</span>
          }
          <div>
            {product && product.axes}
            <SelectDefault
              value={product.quantity}
              variations={getQuantityVariations()}
              handleClickChangeOption={handleClickChangeOption}
              variationId={product.catalogProductId}
            />
          </div>
        </div>
      </div>
      <div styleName="column column-center">
        <span styleName="column-label" />
        <div styleName="column-inner-wrapper">
          <div styleName="unitary-price-wrapper">
            Preço unitário:
            <span styleName="unitary-price-value"><CurrencyFormat value={product.price} /></span>
          </div>
        </div>
      </div>
      <div styleName="column">
        <span styleName="column-label">Total</span>
        <div styleName="column-inner-wrapper">
          <span styleName="item-total-price">
            <CurrencyFormat value={product.quantity * product.price} />
          </span>
        </div>
      </div>
    </div>
  );
}

CartItem.propTypes = {
  handleClick: PropTypes.func,
  showRemoveButton: PropTypes.bool,
  product: PropTypes.shape({
    quantity: PropTypes.number,
    catalogProductId: PropTypes.node,
    brand: PropTypes.string,
    title: PropTypes.string,
    price: PropTypes.node,
    images: PropTypes.string,
    variations_name: PropTypes.string,
    variations_value: PropTypes.string,
  }),
  quantityVariations: PropTypes.number.isRequired,
  handleClickChangeOption: PropTypes.func,
};

CartItem.defaultProps = {
  showRemoveButton: false,
  product: {},
  handleClick: () => {},
  handleClickChangeOption: () => {},
};

export default CartItem;
