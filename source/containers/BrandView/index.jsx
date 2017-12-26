import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { fetchProductsBrands, setFilterProductBrands } from 'Actions';
import { bindActionCreators } from 'redux';
// import _ from 'lodash';
import Helmet from 'react-helmet';
import ShopWindow from 'Components/ShopWindow';
import BannerCampaign from 'Components/BannerCampaign';
import thumbor from 'Helpers/thumbor';
import { shareImageFallback } from 'Config/Constants';
import './BrandView.css';

class BrandView extends Component {
  constructor(props) {
    super(props);
    this.handleLoadMore = this.handleLoadMore.bind(this);
    this.handleLoadMore();
  }

  componentWillUnmount() {
    this.props.setFilterProductBrands(null);
  }

  callFetchProducts(lastPage = 1) {
    const { params } = this.props.brandsProducts;
    this.props.fetchProductsBrands(this.props.match.params.brandId,
      lastPage, this.props.brandsProducts.params, false).then(() => {
        this.props.setFilterProductBrands(
          {
            pageNumber: params.pageNumber + 1,
          },
        );
      });
  }

  handleLoadMore() {
    const { params, loading, pagination } = this.props.brandsProducts;
    const lastPage = params.pageNumber;
    const nextPage = lastPage + 1;
    if (loading || lastPage === nextPage || nextPage > pagination.total_pages) {
      return;
    }
    this.callFetchProducts(lastPage);
  }

  render() {
    const { name, image, cover, about } = this.props.brandsProducts;

    const { slug } = this.props.shop;

    const ogImage = thumbor.setImagePath(cover || shareImageFallback)
      .resize(300, 200)
      .buildUrl();
    return (
      <section>
        <Helmet
          title={name}
          meta={[
              { name: 'description', content: `${name} - ${about}` },
              { property: 'og:title', content: `${name}` },
              { property: 'og:description', content: `${name} - ${about}` },
              { content: ogImage, itemprop: 'image' },
              { property: 'og:image', content: ogImage },
              { property: 'og:image:width', content: 300 },
              { property: 'og:image:height', content: 200 },
              { property: 'og:url', content: window.location.href },
          ]}
        />
        <BannerCampaign
          title={'Marca'}
          subtitle={`${name}`}
          image={`${cover}`}
          brandImage={`${image}`}
        />
        <ShopWindow
          data={this.props.brandsProducts}
          slug={slug}
          onLoadMore={this.handleLoadMore}
        />
      </section>
    );
  }
}

BrandView.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      brandId: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  brandsProducts: PropTypes.shape({
    name: PropTypes.string,
    image: PropTypes.string,
    id: PropTypes.number,
    error: PropTypes.bool,
    products: PropTypes.array,
    loading: PropTypes.bool,
    pagination: PropTypes.shape({}),
    params: PropTypes.shape({}),
    about: PropTypes.string,
    cover: PropTypes.string,
  }),
  shop: PropTypes.shape({
    slug: PropTypes.string,
    name: PropTypes.string,
  }).isRequired,
  fetchProductsBrands: PropTypes.func.isRequired,
  setFilterProductBrands: PropTypes.func.isRequired,
};

BrandView.defaultProps = {
  brandsProducts: {
    name: '',
    image: null,
    products: [],
    pagination: {},
    about: '',
    cover: '',
  },
  params: {},
  shop: {},
};

function mapStateToProps(state) {
  return state;
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ fetchProductsBrands, setFilterProductBrands }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(BrandView);
