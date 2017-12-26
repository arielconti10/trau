import React, { PropTypes } from 'react';
import thumbor from 'Helpers/thumbor';
import Slider from 'react-slick';
/**
 * O CSS deste componente está globalizado.
 * Ver arquivo assets/styles/SlickSlider.css
 */

function ProductSlider({ images }) {
  if (images !== null && images.length) {
    const settings = {
      dots: true,
      infinite: false,
      speed: 0,
      slidesToShow: 1,
      slidesToScroll: 1,
    };
    const slides = images.map(item => (
      <div key={item} className="product-slider-slide">
        <img
          className="product-slider-image"
          src={thumbor.setImagePath(item).resize(555, 0).buildUrl()}
          alt={`Imagem ${item}`}
        />
      </div>
    ));

    return (
      <div className="product-slider">
        <Slider {...settings}>
          {slides}
        </Slider>
      </div>
    );
  }

  return <div />;
}

ProductSlider.propTypes = {
  images: PropTypes.node,
};

ProductSlider.defaultProps = {
  images: null,
};

export default ProductSlider;
