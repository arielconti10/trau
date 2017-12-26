import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { fetchPromotion, setFilterParamsPromotion } from 'Actions';
import { bindActionCreators } from 'redux';
// import _ from 'lodash';
import Helmet from 'react-helmet';
import ShopWindow from 'Components/ShopWindow';
import BannerCampaign from 'Components/BannerCampaign';
import thumbor from 'Helpers/thumbor';
import { shareImageFallback } from 'Config/Constants';
import './CampaignView.css';

class CampaignView extends Component {
  constructor(props) {
    super(props);
    this.handleLoadMore = this.handleLoadMore.bind(this);
    this.handleLoadMore();
  }

  componentWillUnmount() {
    this.props.setFilterParamsPromotion(null);
  }

  callFetchProducts(lastPage = 1) {
    const { params } = this.props.currentCampaign;
    this.props.fetchPromotion(this.props.match.params.campaignId,
      lastPage, this.props.currentCampaign.params, false).then(() => {
        this.props.setFilterParamsPromotion(
          {
            pageNumber: params.pageNumber + 1,
          },
        );
      });
  }

  handleLoadMore() {
    const { params, loading, pagination } = this.props.currentCampaign;
    const lastPage = params.pageNumber;
    const nextPage = lastPage + 1;
    if (loading || lastPage === nextPage || nextPage > pagination.total_pages) {
      return;
    }
    this.callFetchProducts(lastPage);
  }

  render() {
    const { name, cover, subtitle } = this.props.currentCampaign;

    const ogImage = thumbor.setImagePath(cover || shareImageFallback)
      .resize(300, 200)
      .buildUrl();
    return (
      <section>
        <Helmet
          title={name}
          meta={[
            { name: 'description', content: `${name} - ${subtitle}` },
            { property: 'og:title', content: `${name}` },
            { property: 'og:description', content: `${name} - ${subtitle}` },
            { content: ogImage, itemprop: 'image' },
            { property: 'og:image', content: ogImage },
            { property: 'og:image:width', content: 300 },
            { property: 'og:image:height', content: 200 },
            { property: 'og:url', content: window.location.href },
          ]}
        />
        <BannerCampaign
          title={subtitle}
          subtitle={`${name}`}
          image={`${cover}`}
        />
        <ShopWindow
          data={this.props.currentCampaign}
          slug={this.props.shop.slug}
          onLoadMore={this.handleLoadMore}
        />
      </section>
    );
  }
}

CampaignView.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      campaignId: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  currentCampaign: PropTypes.shape({
    name: PropTypes.string,
    image: PropTypes.string,
    cover: PropTypes.string,
    error: PropTypes.bool,
    products: PropTypes.array,
    hasNextPage: PropTypes.bool,
    params: PropTypes.object,
    loading: PropTypes.bool,
    pagination: PropTypes.shape({}),
    subtitle: PropTypes.string,
  }),
  shop: PropTypes.shape({
    slug: PropTypes.string,
    name: PropTypes.string,
  }).isRequired,
  setFilterParamsPromotion: PropTypes.func.isRequired,
  fetchPromotion: PropTypes.func.isRequired,
};

CampaignView.defaultProps = {
  currentCampaign: {
    name: '',
    image: '',
    cover: '',
  },
  params: {},
  shop: {},
};

function mapStateToProps(state) {
  return state;
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ fetchPromotion, setFilterParamsPromotion }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(CampaignView);
