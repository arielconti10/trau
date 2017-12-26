import React, { PropTypes } from 'react';
import { Link } from 'react-router-dom';
import Price from 'Components/Price';
import thumbor from 'Helpers/thumbor';
import { productImageFallback } from 'Config/Constants';
import './ProductListItem.css';

function ProductListItem({ productId, title, image,
  brand, price, columnClass, toProductView }) {
  let imageUrl = image && image.length ? image :
    productImageFallback;
  imageUrl = thumbor.setImagePath(imageUrl).resize(360, 268).buildUrl();

  return (
    <div className={columnClass} styleName="item">
      <div styleName="product">
        <Link
          to={`/p/${productId}`}
          onClick={toProductView}
        >
          <img src={imageUrl} alt={title} styleName="image" />
        </Link>
        <div styleName="info">
          <Link styleName="link" to={`/p/${productId}`}>
            <span styleName="text">
              <span styleName="title">{title}</span>
              <span styleName="brand">{brand}</span>
            </span>
            <Price priceFrom={null} price={price} />
          </Link>
        </div>
      </div>
    </div>
  );
}

ProductListItem.propTypes = {
  title: PropTypes.string.isRequired,
  image: PropTypes.string,
  brand: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired,
  productId: PropTypes.number.isRequired,
  columnClass: PropTypes.string,
  toProductView: PropTypes.func.isRequired,
};

ProductListItem.defaultProps = {
  image: '',
  columnClass: 'col-md-4 col-sm-4 col-xs-6',
};

export default ProductListItem;
