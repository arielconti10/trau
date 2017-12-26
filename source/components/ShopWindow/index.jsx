import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import InfiniteScroll from 'react-infinite-scroller';
import InputRange from 'react-input-range';
import _ from 'lodash';
import { fetchProducts, setFilterParams, toProductView } from 'Actions';
import Loading from 'Components/Loading';
import ProductList from 'Components/ProductList';
import AsideItem from 'Components/AsideItem';
import FilterList from 'Components/FilterList';
import ProductListItem from 'Components/ProductList/ProductListItem';
import './ShopWindow.css';

class ShopWindow extends Component {
  constructor(props) {
    super(props);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    this.updateRangeState = this.updateRangeState.bind(this);

    this.debounceRangeState = _.debounce((value) => {
      this.props.onPriceRangeChange(value);
    }, 700);

    if (!this.state) {
      this.setRangeState(this.props.data.minPrice, this.props.data.maxPrice);
    }
  }

  componentWillReceiveProps(nextProps) {
    const propsShop = this.props.data;
    const nextPropsShop = nextProps.data;

    if (!this.state || propsShop.maxPrice !== nextPropsShop.maxPrice ||
      propsShop.minPrice !== nextPropsShop.minPrice) {
      this.setRangeState(nextPropsShop.minPrice, nextPropsShop.maxPrice);
    }
  }

  setRangeState(min, max) {
    this.state = {
      range: { min, max },
    };
  }

  updateRangeState(value) {
    this.setState({ range: value }, () => {
      this.debounceRangeState(this.state.range);
    });
  }

  render() {
    if (this.props.data.error) {
      return <Redirect to="/error/500" />;
    }

    const { products, maxPrice, minPrice,
      brands, categories, hasNextPage, params, loading } = this.props.data;
    const showSideBar = brands.length || categories.length || params.searchText.length;

    return (
      <div className="container" styleName="container">
        {!!loading &&
          <Loading opaque={!products.length && 1 < 0} />}
        <div styleName="shop-window">
          <div className="container-fluid">
            <div className="row">
              {!!showSideBar && <aside className="col-md-3 visible-md visible-lg">
                {!!params.searchText.length &&
                  <AsideItem type="close" onAction={this.props.onResetFilters}>
                    <span styleName="search-result-summary">Exibindo resultados para:</span>
                    <span styleName="search-result-term">{params.searchText}</span>
                  </AsideItem>}
                {!!categories.length && <AsideItem type="arrow" title="Categorias">
                  <FilterList
                    filters={categories} onChange={this.props.onCategoryChange} name="categories"
                  />
                </AsideItem>}
                {maxPrice > minPrice && <AsideItem title="Preço">
                  <InputRange
                    maxValue={maxPrice}
                    minValue={minPrice}
                    onChange={this.updateRangeState}
                    formatLabel={value => `R$ ${value}`}
                    value={this.state.range}
                  />
                </AsideItem>}
                {!!brands.length && <AsideItem type="arrow" title="Marcas">
                  <FilterList
                    filters={brands} onChange={this.props.onBrandChange} name="brand"
                  />
                </AsideItem>}
              </aside>}
              <div className={showSideBar ? 'col-md-9' : 'col-md-12'} styleName="products">
                <ProductList noSideBar={!showSideBar}>
                  <InfiniteScroll
                    pageStart={0}
                    loadMore={this.props.onLoadMore}
                    hasMore={hasNextPage}
                    loader={<div styleName="loader">Loading!! ...</div>}
                  >
                    {!!products.length && products.map(product => (
                      <ProductListItem
                        columnClass={showSideBar ? 'col-md-4 col-sm-4 col-xs-6' : 'col-md-3 col-sm-4 col-xs-6'}
                        productId={product.id}
                        key={product.id}
                        image={product.images}
                        title={product.name} brand={product.supplier.name}
                        price={product.price}
                        toProductView={this.props.toProductView}
                      />
                    ))}
                    {!loading && !products.length &&
                      <div styleName="no-result">
                        Nenhum produto encontrado <br />
                        <button onClick={this.props.onResetFilters} styleName="no-result-reset">
                          Reiniciar busca
                        </button>
                      </div>}
                  </InfiniteScroll>
                </ProductList>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

ShopWindow.propTypes = {
  data: PropTypes.shape({
    loading: PropTypes.bool,
    error: PropTypes.bool,
    products: PropTypes.array,
    categories: PropTypes.array,
    brands: PropTypes.array,
    maxPrice: PropTypes.number,
    minPrice: PropTypes.number,
    hasNextPage: PropTypes.bool,
    params: PropTypes.object,
    terms: PropTypes.array,
  }).isRequired,
  onCategoryChange: PropTypes.func,
  onBrandChange: PropTypes.func,
  onPriceRangeChange: PropTypes.func,
  onResetFilters: PropTypes.func,
  onLoadMore: PropTypes.func.isRequired,
  toProductView: PropTypes.func.isRequired,
};

ShopWindow.defaultProps = {
  noSidebar: false,
  onCategoryChange: () => {},
  onBrandChange: () => {},
  onPriceRangeChange: () => {},
  onResetFilters: () => {},
};

function mapStateToProps(state) {
  return state;
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ fetchProducts, setFilterParams, toProductView }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ShopWindow);
