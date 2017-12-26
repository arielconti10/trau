import React, { Component, PropTypes } from 'react';
import TitleHeader from 'Components/TitleHeader';
import CampaignsSlider from 'Components/CampaignsSlider';
import ShopWindow from 'Components/ShopWindow';
import TextResults from 'Components/TextResults';
import SearchTags from 'Components/SearchTags';
import StaticTags from 'Components/StaticTags';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchCampaigns, fetchProducts, setFilterParams, toggleFiltersView,
  toProductView } from 'Actions';
import { fromJS } from 'immutable';
import qs from 'qs';
import './StoreIndex.css';

class StoreIndex extends Component {
  constructor(props) {
    super(props);
    this.qs = qs.parse(this.props.location.search.replace('?', ''));
    this.props.fetchCampaigns();
    this.handleLoadMore();
    this.handleCategoryChange = this.handleCategoryChange.bind(this);
    this.handleBrandChange = this.handleBrandChange.bind(this);
    this.handlePriceRangeChange = this.handlePriceRangeChange.bind(this);
    this.handleResetFilters = this.handleResetFilters.bind(this);
    this.handleLoadMore = this.handleLoadMore.bind(this);
  }

  componentWillUnmount() {
    this.props.toProductView(false);
  }

  callFetchProducts(reload = false, lastPage = 1) {
    const { params } = this.props.shopWindow;
    this.props.fetchProducts(this.props.shop.slug,
      this.props.shopWindow.params, reload, lastPage).then(() => {
        this.props.setFilterParams(
          {
            pageNumber: params.pageNumber + 1,
          },
        );
      },
    );
  }

  handleLoadMore() {
    const { params, loading, pagination } = this.props.shopWindow;
    const lastPage = params.pageNumber;
    const nextPage = lastPage + 1;

    if (loading || lastPage === nextPage || nextPage > pagination.total_pages) {
      return;
    }
    this.callFetchProducts(false, lastPage);
  }

  handleCategoryChange(item) {
    const filters = fromJS(this.props.shopWindow.params.categories);
    const alreadyCategory = this.props.shopWindow.params.categories.filter(t => t.id === item.id);
    const getFilters = () => {
      if (alreadyCategory.length > 0) {
        return filters.filter(i => i.get('id') !== item.id);
      }
      return filters.push(item);
    };
    this.props.setFilterParams({
      categories: getFilters().toJS(),
      pageNumber: 0,
    }).then(() => {
      this.callFetchProducts(true, 1);
    });
    window.scrollTo(0, 0);
  }

  handleBrandChange(item) {
    const filters = fromJS(this.props.shopWindow.params.brands);
    const alreadyBrands = this.props.shopWindow.params.brands.filter(t => t.id === item.id);
    const getFilters = () => {
      if (alreadyBrands.length > 0) {
        return filters.filter(i => i.get('id') !== item.id);
      }
      return filters.push(item);
    };
    this.props.setFilterParams({
      brands: getFilters().toJS(),
      pageNumber: 0,
    }).then(() => {
      this.callFetchProducts(true, 1);
    });
    window.scrollTo(0, 0);
  }

  handlePriceRangeChange(value) {
    this.props.setFilterParams({
      minPrice: value.min,
      maxPrice: value.max,
      pageNumber: 1,
    }).then(() => {
      this.callFetchProducts(true);
    });
  }

  handleSearchTextChange() {
    this.props.setFilterParams({
      searchText: '',
      pageNumber: 0,
    }).then(() => {
      this.callFetchProducts(true);
    });
  }

  handleResetFilters() {
    this.props.setFilterParams(null).then(() => {
      this.callFetchProducts(true);
    });
  }

  render() {
    const isNotMobile = window.innerWidth > 768;
    const paramValues = Object.values(this.props.shopWindow.params);
    const hasParams = paramValues.some((e) => {
      let el = e;
      if (el !== null) {
        el = e.length > 0 || e.lenght !== undefined;
      }
      return el;
    });

    const { params } = this.props.shopWindow;
    const filteredBrands = params.brands;
    const filteredCategories = params.categories;
    const total = this.props.shopWindow.pagination.total_count;
    return (
      <div styleName="store-wrapper">
        {!!this.props.campaigns.length && <section>
          <TitleHeader view={hasParams}>Últimos destaques</TitleHeader>
          <TextResults view={hasParams} total={total} onResetFilters={this.handleResetFilters}>
            {isNotMobile &&
              <span>
                {filteredBrands && filteredBrands.map(t =>
                  <SearchTags
                    key={t.id}
                    text={t.name}
                    onClick={() => {
                      this.handleBrandChange(t);
                    }}
                  />,
                )}
                {filteredCategories && filteredCategories.map(t =>
                  <SearchTags
                    key={t.id}
                    text={t.name}
                    onClick={() => {
                      this.handleCategoryChange(t);
                    }}
                  />,
                )}
                {this.props.shopWindow.params.searchText &&
                  <SearchTags
                    key={this.props.shopWindow.params.searchText}
                    text={this.props.shopWindow.params.searchText}
                    onClick={() => {
                      this.handleSearchTextChange();
                    }}
                  />
                }
              </span>
            }

            {!isNotMobile &&
              <span>
                {[].concat(filteredBrands, filteredCategories).map((t, c, arr) => {
                  let sep = '';
                  if (arr.length > 0 && c < arr.length - 1) {
                    sep = ',';
                  }
                  return <StaticTags key={t.name} text={t.name} sep={sep} />;
                },
                )}
                {this.props.shopWindow.params.searchText &&
                  <StaticTags
                    key={this.props.shopWindow.params.searchText}
                    text={this.props.shopWindow.params.searchText}
                  />
                }
              </span>
            }
          </TextResults>
          <CampaignsSlider
            campaigns={this.props.campaigns}
            view={hasParams}
          />
        </section>}
        <section>
          <ShopWindow
            data={this.props.shopWindow}
            slug={this.props.shop.slug}
            onCategoryChange={this.handleCategoryChange}
            onBrandChange={this.handleBrandChange}
            onPriceRangeChange={this.handlePriceRangeChange}
            onResetFilters={this.handleResetFilters}
            onLoadMore={this.handleLoadMore}
          />
        </section>
      </div>
    );
  }
}

StoreIndex.propTypes = {
  location: PropTypes.shape({
    search: PropTypes.string,
  }).isRequired,
  toProductView: PropTypes.func,
  shopWindow: PropTypes.shape({
    loading: PropTypes.bool.isRequired,
    error: PropTypes.bool.isRequired,
    products: PropTypes.array.isRequired,
    categories: PropTypes.array.isRequired,
    brands: PropTypes.array.isRequired,
    maxPrice: PropTypes.number.isRequired,
    minPrice: PropTypes.number.isRequired,
    hasNextPage: PropTypes.bool.isRequired,
    params: PropTypes.object.isRequired,
    isCampaign: PropTypes.bool.isRequired,
    isProductView: PropTypes.bool.isRequired,
    pagination: PropTypes.shape({
      total_count: PropTypes.node,
    }),
  }).isRequired,
  fetchCampaigns: PropTypes.func.isRequired,
  campaigns: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string,
    image: PropTypes.string,
  })).isRequired,
  shop: PropTypes.shape({
    slug: PropTypes.string,
  }).isRequired,
  fetchProducts: PropTypes.func.isRequired,
  setFilterParams: PropTypes.func.isRequired,
};

StoreIndex.defaultProps = {
  toProductView: () => {},
  shopWindow: PropTypes.shape({
    pagination: PropTypes.shape({
      total_count: 1,
    }),
  }).isRequired,
};

function mapStateToProps(state) {
  return state;
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    fetchCampaigns,
    fetchProducts,
    setFilterParams,
    toggleFiltersView,
    toProductView }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(StoreIndex);
