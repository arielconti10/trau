import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { fetchProductsCategory, setFilterProductCategory } from 'Actions';
import { bindActionCreators } from 'redux';
// import _ from 'lodash';
import Helmet from 'react-helmet';
import ShopWindow from 'Components/ShopWindow';
import BannerCampaign from 'Components/BannerCampaign';
import thumbor from 'Helpers/thumbor';
import { shareImageFallback } from 'Config/Constants';
import './CategoryView.css';

class CategoryView extends Component {
  constructor(props) {
    super(props);
    this.handleLoadMore = this.handleLoadMore.bind(this);
    this.handleLoadMore();
  }

  componentWillUnmount() {
    this.props.setFilterProductCategory(null);
  }

  callFetchProducts(lastPage = 1) {
    const { params } = this.props.categoryProducts;
    this.props.fetchProductsCategory(this.props.match.params.categoryId,
      lastPage, this.props.categoryProducts.params, false).then(() => {
        this.props.setFilterProductCategory(
          {
            pageNumber: params.pageNumber + 1,
          },
        );
      });
  }

  handleLoadMore() {
    const { params, loading, pagination } = this.props.categoryProducts;
    const lastPage = params.pageNumber;
    const nextPage = lastPage + 1;
    if (loading || lastPage === nextPage || nextPage > pagination.total_pages) {
      return;
    }
    this.callFetchProducts(lastPage);
  }

  render() {
    const { name, image } = this.props.categoryProducts;
    const { slug } = this.props.shop;
    const ogImage = thumbor.setImagePath(image || shareImageFallback)
      .resize(300, 200)
      .buildUrl();

    return (
      <section>
        <Helmet
          title={name}
          meta={[
            { name: 'description', content: `${name} - Categoria de produtos` },
            { property: 'og:title', content: `${name}` },
            { property: 'og:description', content: `${name} - Categoria de produtos` },
            { content: ogImage, itemprop: 'image' },
            { property: 'og:image', content: ogImage },
            { property: 'og:image:width', content: 300 },
            { property: 'og:image:height', content: 200 },
            { property: 'og:url', content: window.location.href },
          ]}
        />
        <BannerCampaign
          title={'Categoria'}
          subtitle={`${name}`}
          image={`${image}`}
        />
        <ShopWindow
          data={this.props.categoryProducts}
          slug={slug}
          onLoadMore={this.handleLoadMore}
        />
      </section>
    );
  }
}

CategoryView.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      categoryId: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  categoryProducts: PropTypes.shape({
    name: PropTypes.string,
    image: PropTypes.string,
    id: PropTypes.number,
    error: PropTypes.bool,
    products: PropTypes.array,
    loading: PropTypes.bool,
    pagination: PropTypes.shape({}),
    params: PropTypes.shape({}),
  }),
  shop: PropTypes.shape({
    slug: PropTypes.string,
    name: PropTypes.string,
  }).isRequired,
  fetchProductsCategory: PropTypes.func.isRequired,
  setFilterProductCategory: PropTypes.func.isRequired,
};

CategoryView.defaultProps = {
  categoryProducts: {
    name: '',
    image: null,
    products: [],
    pagination: {},
  },
  params: {},
  shop: {},
};

function mapStateToProps(state) {
  return state;
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ fetchProductsCategory, setFilterProductCategory }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(CategoryView);
