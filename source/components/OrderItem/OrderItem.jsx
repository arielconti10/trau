import React, { PropTypes } from 'react';
import CurrencyFormat from 'Components/CurrencyFormat';
import { Hiroto } from 'Helpers/Image';
import placeholder from '../../assets/imgs/placeholder.jpg';
import './OrderItem.css';

function OrderItem({ product }) {
  const images = product.images ? product.images : placeholder;
  return (
    <div styleName="product-item">
      <div styleName="product-image-column">
        <div styleName="product-image-wrapper">
          <img
            styleName="product-image" src={Hiroto(images, { size: '260x260' })} alt={images}
          />
        </div>
      </div>
      <div styleName="product-info-column">
        <div styleName="product-title">{product.name}</div>
        <div styleName="product-brand">{product.supplier.name}</div>
        {product && product.axes}
        <div styleName="product-quantity">
          Quantidade:<br />
          <span styleName="variation-static-box">{product.quantity}</span>
        </div>
        {product.variations &&
          <div styleName="product-quantity">
            {product.variations_title}:<br />
            <span styleName="variation-static-box">{product.variations}</span>
          </div>
        }
        <span styleName="product-price">
          Preço unitário <CurrencyFormat value={product.final_price} />
        </span>
      </div>
    </div>
  );
}

OrderItem.propTypes = {
  product: PropTypes.shape({
    quantity: PropTypes.number,
    catalogProductId: PropTypes.node,
    price: PropTypes.node,
    images: PropTypes.arrayOf(PropTypes.string),
    supplier: PropTypes.shape({
      name: PropTypes.string,
    }),
  }),
};

OrderItem.defaultProps = {
  product: {},
};

export default OrderItem;
