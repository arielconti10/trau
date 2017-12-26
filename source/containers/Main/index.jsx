import React, { Component, PropTypes } from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import Helmet from 'react-helmet';
import { compose } from 'recompose';
import { Route, Redirect, Switch, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchProducts, setFilterParams,
  logout, fetchCampaigns, fetchCategories, fetchBrands, removeCart } from 'Actions';
import { facebook as facebookConfig } from 'Config/Constants';
import { fromJS } from 'immutable';
import PrivateRoute from 'Components/PrivateRoute';
import Header from 'Components/Header';
import Footer from 'Components/Footer';
import Loading from 'Components/Loading';
import StoreIndex from 'Containers/StoreIndex';
import SignUp from 'Containers/SignUp';
import Cart from 'Containers/Cart';
import Shipping from 'Containers/Shipping';
import CustomListView from 'Containers/CustomListView';
import Account from 'Containers/Account';
import RecoverPassword from 'Containers/RecoverPassword';
import ProductView from 'Containers/ProductView';
import CampaignView from 'Containers/CampaignView';
import CategoryView from 'Containers/CategoryView';
import BrandView from 'Containers/BrandView';
import NewPassword from 'Containers/NewPassword';
import ErrorView from 'Containers/ErrorView';
import LoginSignUp from 'Containers/LoginSignUp';
import FacebookLogin from 'Containers/FacebookLogin';
import ListMenuItem from 'Components/ListMenu/ListMenuItem';
import ListMenu from 'Components/ListMenu';
import StoreShortcut from 'Components/StoreShortcut';
import SideMenu from 'Components/SideMenu';
import thumbor from 'Helpers/thumbor';
import placeholder from '../../assets/imgs/placeholder.jpg';
import './Main.css';

class Main extends Component {
  constructor(props) {
    super(props);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleHambClick = this.handleHambClick.bind(this);
    this.handleMenuStateChange = this.handleMenuStateChange.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
    this.handleCategoryChange = this.handleCategoryChange.bind(this);
    this.handleBrandChange = this.handleBrandChange.bind(this);
    this.handleResetFilters = this.handleResetFilters.bind(this);
    this.checkforParameters = this.checkforParameters.bind(this);
    this.searchViewState = this.searchViewState.bind(this);

    if (!this.props.shop.slug) {
      this.props.shop.slug = this.props.slug;
    }

    this.state = {
      highlightSearch: true,
    };
  }

  componentWillReceiveProps() {
    this.state = {
      isMenuOpen: false,
    };
  }

  checkforParameters() {
    const paramValues = Object.values(this.props.shopWindow.params);
    const hasParams = paramValues.some((e) => {
      if (e !== null) {
        if (e.length > 0 && e.length !== undefined) {
          return true;
        }
      }
      return false;
    });
    return hasParams;
  }

  handleSearch(values) {
    const search = values.name ? values.name : values.search;
    const { slug } = this.props;
    this.props.setFilterParams({
      searchText: search || '',
      pageNumber: 0,
    }).then(() => {
      this.props.fetchProducts(slug, this.props.shopWindow.params, true);
    });
    this.props.history.push('/');
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
      this.callFetchProducts(true);
      this.searchViewState();
    });
    this.props.history.push('/');
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
      this.callFetchProducts(true);
      this.searchViewState();
    });
    this.props.history.push('/');
  }

  callFetchProducts(reload = false) {
    this.props.fetchProducts(this.props.shop.slug,
      this.props.shopWindow.params, reload);
  }

  searchViewState() {
    if (!this.checkforParameters()) {
      this.setState({
        highlightSearch: false,
      });
    }
  }

  handleResetFilters() {
    this.props.setFilterParams(null).then(() => {
      this.callFetchProducts(true);
      this.searchViewState();
    });
  }

  handleLogout() {
    this.props.logout().then(() => {
      this.props.removeCart();
    });
    const redirectUrl = '';
    if (this.props.match.url !== redirectUrl) {
      this.props.history.push(redirectUrl);
    }
  }

  handleHambClick() {
    this.setState({
      isMenuOpen: true,
    });
  }

  handleMenuStateChange(state) {
    if (state.isOpen) {
      return;
    }
    this.setState({
      isMenuOpen: false,
    });
  }

  render() {
    const { slug, shop, user, shopWindow, cart } = this.props;
    if (this.props.shop.error) {
      return <Redirect to="/" />;
    }

    if (this.props.shop.loading) {
      return <Loading onTop />;
    }

    const isAuthenticated = !!user.token || false;

    const listMenuItems = !isAuthenticated ? [
      <ListMenuItem key="1" to="/">Home</ListMenuItem>,
      <ListMenuItem key="2" to="/login">Entrar</ListMenuItem>,
      <ListMenuItem key="3" to="/cart">Carrinho</ListMenuItem>,
    ] : [
      <ListMenuItem key="1" to="/">Home</ListMenuItem>,
      <ListMenuItem key="2" to="/account">Meus Dados</ListMenuItem>,
      <ListMenuItem key="3" to="/cart">Carrinho</ListMenuItem>,
      <ListMenuItem key="4" to="/cart" styles="link--faded" onClick={this.handleLogout} hasAction>
        Sair
      </ListMenuItem>,
    ];

    const image = shop.image && shop.image.length ? shop.image : placeholder;
    const title = shop.title ? shop.title : `Loja ${shop.name}`;
    const ogImage = thumbor.setImagePath(image);
    return (
      <div id="outer-container">
        <Helmet
          titleTemplate={`%s - ${title} - Lua`}
          defaultTitle={`${title} - Lua`}
          meta={[
              { name: 'description', content: shop.description || title },
              { property: 'fb:app_id', content: facebookConfig.id },
              { property: 'og:title', content: title },
              { property: 'og:description', content: shop.description || title },
              { property: 'og:url', content: window.location.href },
              { property: 'og:image', content: ogImage.resize(300, 200).buildUrl() },
              { content: ogImage.resize(300, 200).buildUrl(), itemprop: 'image' },
              { property: 'og:image:width', content: 300 },
              { property: 'og:image:height', content: 200 },
              { property: 'og:type', content: 'website' },
              { property: 'og:locale', content: 'pt_BR' },
          ]}
          link={[
            {
              rel: 'shortcut icon',
              href: ogImage.resize(32, 32)
                .filter('round_corner(16,255,255,255)')
                .buildUrl() },
          ]}
        />
        <div id="page-wrap" styleName={this.state.isMenuOpen ? 'page-wrap--blur' : ''}>
          <Header
            filters={this.props.shopWindow}
            shop={shop} onSearch={this.handleSearch}
            searchParams={this.props.shopWindow.params}
            onHambClick={this.handleHambClick}
            searchTerm={shopWindow.params.searchText}
            cartQuantity={cart.products.length}
            handleCategoryChange={this.handleCategoryChange}
            handleBrandChange={this.handleBrandChange}
            handleResetFilters={this.handleResetFilters}
            history={this.props.history}
            highlightSearch={this.state.highlightSearch}
            checkforParameters={this.checkforParameters}
          />
          <StoreShortcut image={shop.image} name={shop.name} />
          <Switch>
            <Route path={'/recover-password'} component={RecoverPassword} />
            <Route path={'/p/:catalogId'} component={ProductView} />
            <Route path={'/login'} component={LoginSignUp} />
            <Route path={'/signup/step/:step'} component={SignUp} />
            <Route path={'/cart'} component={Cart} />
            <Route path={'/c/:campaignId'} component={CampaignView} />
            <Route path={'/shipping'} component={Shipping} />
            <Route path={'/customlist/:customListId'} component={CustomListView} />
            <Route path={'/category/:categoryId'} component={CategoryView} />
            <Route path={'/brand/:brandId'} component={BrandView} />
            <Route path={'/new-password'} component={NewPassword} />
            <Route path={'/facebook-login'} component={FacebookLogin} />
            <PrivateRoute
              path={'/account'}
              component={Account}
              isAuthenticated={isAuthenticated}
              slug={slug}
            />
            <Route exact path={'/'} component={StoreIndex} />
            <Route
              path={'/signup'} render={data => (
                <Redirect to={`${data.match.url}/step/1`} />
              )}
            />
            <Route
              path={'/home'} render={() => (
                <Redirect to={'/'} />
              )}
            />
            <Route path="/error/:code" component={ErrorView} />
            <Route render={() => <Redirect to="/error/404" />} />
          </Switch>
          <Footer shop={shop} />
        </div>
        <SideMenu
          isOpen={this.state.isMenuOpen}
          onStateChange={this.handleMenuStateChange}
          user={this.props.user}
        >
          <ListMenu>
            {listMenuItems}
          </ListMenu>
        </SideMenu>
      </div>
    );
  }
}

Main.propTypes = {
  match: PropTypes.shape({
    url: PropTypes.string.isRequired,
    params: PropTypes.shape({}).isRequired,
  }).isRequired,
  shop: PropTypes.shape({
    loading: PropTypes.bool.isRequired,
    error: PropTypes.bool.isRequired,
    slug: PropTypes.string.isRequired,
    image: PropTypes.string,
    name: PropTypes.string,
    title: PropTypes.string,
  }).isRequired,
  user: PropTypes.shape({
    token: PropTypes.string,
  }).isRequired,
  cart: PropTypes.shape({
    id: PropTypes.number,
    products: PropTypes.array,
  }).isRequired,
  shopWindow: PropTypes.shape({
    params: PropTypes.object.isRequired,
  }).isRequired,
  fetchProducts: PropTypes.func.isRequired,
  removeCart: PropTypes.func.isRequired,
  logout: PropTypes.func.isRequired,
  setFilterParams: PropTypes.func.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
    listen: PropTypes.func.isRequired,
  }).isRequired,
  slug: PropTypes.string.isRequired,
};

Main.defaultProps = {
  image: '',
  name: '',
};

const enhance = compose(
  withRouter,
  connect(
    state => state,
    dispatch => bindActionCreators({
      fetchProducts,
      fetchBrands,
      setFilterParams,
      logout,
      fetchCampaigns,
      fetchCategories,
      removeCart,
    }, dispatch),
  ),
);

export default enhance(Main);
