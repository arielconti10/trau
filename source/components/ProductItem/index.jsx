import React, { PropTypes } from 'react';
import CurrencyFormat from 'Components/CurrencyFormat';
import './ProductItem.css';

function ProductItem({
  product,
}) {
  return (
    <div styleName="product-row">
      <div className="col-md-6">
        <strong styleName="product-name">{product.quantity}x {product.title}</strong><br />
        <span styleName="product-brand">{product.brand}</span>
      </div>
      <div className="col-md-4">
        <span styleName="price">
          Preço unitário <span styleName="price-highlight">
            <CurrencyFormat value={product.price} /></span>
        </span>
      </div>
      <div className="col-md-2">
        <strong styleName="product-price"><CurrencyFormat value={product.price} /></strong>
      </div>
    </div>
  );
}

ProductItem.propTypes = {
  product: PropTypes.shape({
    quantity: PropTypes.number,
    variationId: PropTypes.number,
    brand: PropTypes.string,
    title: PropTypes.string,
    price: PropTypes.node,
    images: PropTypes.string,
  }).isRequired,
};

export default ProductItem;
