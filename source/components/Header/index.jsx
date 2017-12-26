import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router-dom';
import Profile from 'Components/Profile';
import SearchBar from 'Components/SearchBar';
import { connect } from 'react-redux';
import { toggleFiltersView, toProductView } from 'Actions';
import { bindActionCreators } from 'redux';
import SearchFilters from 'Components/SearchFilters';
import './Header.css';

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filtersViews: false,
      highlightSearch: false,
      tabSelected: null,
      ifTagsScrolls: true,
      tabsView: false,
    };
    this.handleSearchHighlight = this.handleSearchHighlight.bind(this);
    this.updateFilterViews = this.updateFilterViews.bind(this);
    this.selectTab = this.selectTab.bind(this);
    this.onTagsScroll = this.onTagsScroll.bind(this);
    this.searchOpen = this.searchOpen.bind(this);
    this.searchClose = this.searchClose.bind(this);
    this.showResults = this.showResults.bind(this);
    this.hideFiltersAndTabs = this.hideFiltersAndTabs.bind(this);
  }

  componentDidUpdate() {
    this.props.history.listen((params) => {
      const str = params.pathname;
      const isNotHome = /\/[a-zA-Z]+\/.+/g.test(str);
      const isMobile = window.innerWidth < 768;

      if (!isNotHome && this.props.checkforParameters() && isMobile) {
        this.props.toggleFiltersView(true);
        this.props.toProductView(true);
        this.state.highlightSearch = true;
        this.state.tabsView = true;
        this.state.filtersViews = false;
      } else if (!isNotHome && this.props.checkforParameters() && !isMobile) {
        this.state.highlightSearch = false;
        this.state.tabsView = true;
        this.state.filtersViews = false;
      } else if (isNotHome) {
        this.state.highlightSearch = false;
      }
    });

    if (!this.props.highlightSearch) {
      this.state.highlightSearch = false;
      this.state.tabsView = false;
      this.state.filtersViews = false;
    }
  }

  onTagsScroll(scrolled) {
    this.setState({
      ifTagsScrolls: scrolled,
    });

    if (!scrolled) {
      this.setState({ tabSelected: null });
      const el = document.getElementById('tags-wrapper');
      window.setTimeout(() => {
        el.scrollLeft = 10000;
      }, 10);
    }
  }

  searchOpen() {
    this.props.toggleFiltersView(true);
    this.setState({
      highlightSearch: true,
      tabsView: true,
      filtersViews: true,
    });
  }

  showResults() {
    if (this.props.checkforParameters()) {
      this.setState({
        filtersViews: false,
        tabSelected: null,
      });
    }
  }

  searchClose() {
    this.setState({
      highlightSearch: false,
      tabsView: false,
      filtersViews: false,
      tabSelected: null,
    });

    if (this.props.checkforParameters()) {
      this.props.handleResetFilters();
    }
  }

  hideFiltersAndTabs() {
    this.setState({
      highlightSearch: true,
      tabsView: true,
      filtersViews: false,
      tabSelected: null,
    });
  }

  handleSearchHighlight(value = null) {
    this.setState({ highlightSearch: value || !this.state.highlightSearch });
  }

  updateFilterViews(filter) {
    this.setState({
      filtersViews: filter,
    });

    if (!filter) {
      this.setState({
        tabSelected: null,
      });
    }
  }

  selectTab(i) {
    this.setState({
      tabSelected: i,
      filtersViews: true,
    });
  }

  render() {
    const {
      shop,
      onSearch,
      onHambClick,
      cartQuantity,
      searchTerm,
      handleCategoryChange,
      handleBrandChange,
      handleResetFilters } = this.props;

    const { highlightSearch, filtersViews, tabSelected, ifTagsScrolls, tabsView } = this.state;
    const { brands, categories, searchFilterView, isProductView } = this.props.filters;

    return (
      <div styleName="wrapper">
        <header styleName={`header ${highlightSearch ? 'active-search' : ''}`}>
          <div className="container" styleName="container">
            <div styleName="profile-widget-column">
              <Profile
                image={shop.image} name={shop.name} slug={shop.slug} phone={shop.phone}
                email={shop.email} city={shop.city} title={shop.title}
                disabled={highlightSearch}
              />
            </div>
            <div styleName="search-bar-column">
              <SearchBar
                onSubmit={onSearch} visible={highlightSearch}
                onVisiblityChange={this.handleSearchHighlight}
                searchTerm={searchTerm}
                brands={brands}
                categories={categories}
                onClickSearch={this.updateFilterViews}
                onCategoryChange={handleCategoryChange}
                onBrandChange={handleBrandChange}
                onResetFilters={handleResetFilters}
                visualisation={filtersViews}
                ifTagsScrolls={ifTagsScrolls}
                onTagsScroll={this.onTagsScroll}
                searchFilterView={searchFilterView}
                isProductView={isProductView}
                checkforParameters={this.props.checkforParameters}
                searchOpen={this.searchOpen}
                searchClose={this.searchClose}
                showResults={this.showResults}
                hideFiltersAndTabs={this.hideFiltersAndTabs}
              />
            </div>
            <div styleName="navigation-list-column">
              <Link styleName="cart-link" to={'/cart'}>
                Carrinho {cartQuantity > 0 && <i styleName="cart-link-itens">{`${cartQuantity}`}</i>}
              </Link>
              <button styleName="menu-trigger" onClick={onHambClick}>Menu</button>
            </div>
          </div>
        </header>
        {searchFilterView &&
          <SearchFilters
            searchTerm={searchTerm}
            brands={brands}
            categories={categories}
            filters={this.props.filters}
            visualisation={{ filtersViews }}
            onCategoryChange={handleCategoryChange}
            onBrandChange={handleBrandChange}
            onResetFilters={handleResetFilters}
            onFilterClick={this.updateFilterViews}
            selectTab={this.selectTab}
            tab={tabSelected}
            tabsView={tabsView}
          />
        }
      </div>
    );
  }
}

Header.propTypes = {
  shop: PropTypes.shape({
    image: PropTypes.string,
    name: PropTypes.string,
    slug: PropTypes.string,
    title: PropTypes.string,
    email: PropTypes.string,
    city: PropTypes.string,
    phone: PropTypes.string,
  }).isRequired,
  toggleFiltersView: PropTypes.func,
  toProductView: PropTypes.func,
  cartQuantity: PropTypes.number,
  searchTerm: PropTypes.string.isRequired,
  onSearch: PropTypes.func.isRequired,
  onHambClick: PropTypes.func.isRequired,
  highlightSearch: PropTypes.bool.isRequired,
  filters: PropTypes.shape({
    brands: PropTypes.array,
    categories: PropTypes.array,
    searchFilterView: PropTypes.bool.isRequired,
    isProductView: PropTypes.bool.isRequired,
    params: PropTypes.object.isRequired,
  }).isRequired,
  handleCategoryChange: PropTypes.func.isRequired,
  handleBrandChange: PropTypes.func.isRequired,
  handleResetFilters: PropTypes.func.isRequired,
  checkforParameters: PropTypes.func.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
    listen: PropTypes.func.isRequired,
  }).isRequired,
};

Header.defaultProps = {
  highlightSearch: true,
  cartQuantity: 0,
  toggleFiltersView: () => {},
  toProductView: () => {},
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ toggleFiltersView, toProductView }, dispatch);
}

export default connect(null, mapDispatchToProps)(Header);
