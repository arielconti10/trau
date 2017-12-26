import React, { PropTypes } from 'react';
import thumbor from 'Helpers/thumbor';
import { productImageFallback } from 'Config/Constants';
import './BannerCampaign.css';

function BannerCampaign({
  title,
  subtitle,
  image,
  brandImage,
}) {
  const brandImageUrl = thumbor.setImagePath(brandImage || productImageFallback)
  .resize(200, 200).buildUrl();
  const imageUrl = thumbor.setImagePath(image || productImageFallback).buildUrl();
  // debugger;
  const renderBrandImageLayout = () => (
    <div>
      <div styleName="brand-image-wrapper">
        <div styleName="brand-image">
          <img src={brandImageUrl} width={'100%'} height={'100%'} alt="brand" />
        </div>
      </div>
      <div styleName="categorie">{subtitle}</div>
    </div>
  );

  const renderRegularLayout = () => (
    <div>
      <div styleName="title">{title}</div>
      <div styleName="categorie">{subtitle}</div>
    </div>
  );

  return (
    <div styleName="container">
      <div
        styleName={`image ${brandImage ? '' : 'image_random'}`}
        style={{ backgroundImage: `url(${imageUrl})` }}
      />
      <div styleName="card--shadow" />
      <div styleName="wrapper">
        {brandImage &&
          renderBrandImageLayout()
        }
        {!brandImage &&
          renderRegularLayout()
        }
      </div>
    </div>
  );
}

BannerCampaign.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
  brandImage: PropTypes.string,
};

BannerCampaign.defaultProps = {
  title: '',
  brandImage: null,
};

export default BannerCampaign;
