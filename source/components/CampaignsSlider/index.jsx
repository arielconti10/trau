import React, { PropTypes } from 'react';
import Slider from 'react-slick';
import { Link } from 'react-router-dom';
import thumbor from 'Helpers/thumbor';
import './CampaignsSlider.css';
import placeholder from '../../assets/imgs/placeholder.jpg';

function CampaignsSlider({ campaigns, view }) {
  const settings = {
    autoplay: true,
    dots: false,
    infinite: true,
    speed: 500,
    autoplaySpeed: 7000,
    slidesToShow: 3,
    slidesToScroll: 3,
    arrows: true,
    responsive: [
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };
  return (
    <div className="campaign-slider" styleName={`slider ${view ? 'hide-slider' : ''}`}>
      {campaigns.length > 0 &&
        <Slider {...settings}>
          {campaigns.map(campaign => (
            <div key={campaign.id} className="campaign-slider-slide" styleName="slide">
              <Link to={`/c/${campaign.id}`} styleName="campaign-block-link">
                <div styleName="campaign-image-wrapper">
                  <img
                    className="campaign-slider-image"
                    src={thumbor.setImagePath(campaign.image).resize(590, 0).buildUrl()}
                    alt={campaign.name}
                  />
                </div>
                <div styleName="campaign-slide-content-wrapper">
                  <span styleName="campaign-type">{campaign.subtitle}</span>
                  <span styleName="campaign-name">{campaign.name}</span>
                  <div styleName="campaign-product-thumbnail-list">
                    {campaign.products.map(product => (
                      <div
                        key={`campaign_product_${product.id.toString()}`}
                        styleName="campaign-product-thumbnail-wrapper"
                      >
                        <img
                          src={product.images !== null && product.images.length > 0 ?
                            thumbor.setImagePath(product.images[0]).resize(68, 68).buildUrl() :
                            placeholder}
                          alt={product.name}
                          styleName="campaign-product-thumbnail"
                        />
                      </div>
                    ))}
                  </div>
                  <span styleName="campaign-call-to-action">Compre agora</span>
                </div>
              </Link>
            </div>))}
        </Slider>
      }
    </div>
  );
}

CampaignsSlider.propTypes = {
  campaigns: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    image: PropTypes.string,
    products: PropTypes.arrayOf(PropTypes.shape({})),
  })).isRequired,
  view: PropTypes.bool.isRequired,
};

export default CampaignsSlider;
