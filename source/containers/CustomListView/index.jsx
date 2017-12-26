import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { fetchCustomList, setFilterParamsCustomList } from 'Actions';
import { bindActionCreators } from 'redux';
// import _ from 'lodash';
import Helmet from 'react-helmet';
import ShopWindow from 'Components/ShopWindow';
import BannerCampaign from 'Components/BannerCampaign';
import thumbor from 'Helpers/thumbor';
import { shareImageFallback } from 'Config/Constants';
import './PromotionView.css';

class CustomListView extends Component {
  constructor(props) {
    super(props);
    this.handleLoadMore = this.handleLoadMore.bind(this);
    this.handleLoadMore();
  }

  componentWillUnmount() {
    this.props.setFilterParamsCustomList(null);
  }

  callFetchProducts(lastPage = 1) {
    const { params } = this.props.customList;
    this.props.fetchCustomList(this.props.match.params.customListId,
      lastPage, this.props.customList.params, false).then(() => {
        this.props.setFilterParamsCustomList(
          {
            pageNumber: params.pageNumber + 1,
          },
        );
      });
  }

  handleLoadMore() {
    const { params, loading, pagination } = this.props.customList;
    const lastPage = params.pageNumber;
    const nextPage = lastPage + 1;
    if (loading || lastPage === nextPage || nextPage > pagination.total_pages) {
      return;
    }
    this.callFetchProducts(lastPage);
  }

  render() {
    const { name, image } = this.props.customList;

    const { slug } = this.props.shop;
    const ogImage = thumbor.setImagePath(image || shareImageFallback)
      .resize(300, 200)
      .buildUrl();

    return (
      <section>
        <Helmet
          title={name}
          meta={[
            { name: 'description', content: name },
            { property: 'og:title', content: name },
            { property: 'og:description', content: name },
            { content: ogImage, itemprop: 'image' },
            { property: 'og:image', content: ogImage },
            { property: 'og:image:width', content: 300 },
            { property: 'og:image:height', content: 200 },
            { property: 'og:url', content: window.location.href },
          ]}
        />
        <BannerCampaign
          title={'Destaque'}
          subtitle={`${name}`}
          image={`${image}`}
        />
        <ShopWindow
          data={this.props.customList}
          slug={slug}
          onLoadMore={this.handleLoadMore}
        />
      </section>
    );
  }
}

CustomListView.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      customListId: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  customList: PropTypes.shape({
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
  fetchCustomList: PropTypes.func.isRequired,
  setFilterParamsCustomList: PropTypes.func.isRequired,
};

CustomListView.defaultProps = {
  customList: {
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
  return bindActionCreators({ fetchCustomList, setFilterParamsCustomList }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(CustomListView);
