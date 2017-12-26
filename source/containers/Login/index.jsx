import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { authenticate, connectFacebook, clearLoginAttempt, addToCart } from 'Actions';
import TitleHeader from 'Components/TitleHeader';
import LoginForm from 'Components/LoginForm';
import Loading from 'Components/Loading';
import qs from 'qs';

class Login extends Component {
  constructor(props) {
    super(props);
    this.qs = qs.parse(this.props.location.search.replace('?', ''));
    this.handleSubmit = this.handleSubmit.bind(this);
    this.clickHandlerFacebook = this.clickHandlerFacebook.bind(this);
  }

  componentWillMount() {
    this.props.clearLoginAttempt();
  }

  componentWillReceiveProps(nextProps) {
    const { slug } = nextProps.shop;
    const { token, facebookData } = nextProps.user;
    this.tryRedirectAfterLogin(slug, token);
    this.tryFacebookSignUp(slug, facebookData);
  }

  tryFacebookSignUp(slug, facebookData) {
    if (facebookData && facebookData.token) {
      this.props.addToCart(this.props.cart.id, this.props.user.id);
      this.props.history.push(`/${slug}/signup/step/1`);
    }
  }

  tryRedirectAfterLogin(slug, token) {
    if (token) {
      const { url } = this.qs;
      this.props.history.push(url || '/');
    }
  }

  handleSubmit(values) {
    const data = {
      username: values.email,
      password: values.password,
    };
    this.props.authenticate('LOCAL', data).then(() => {
      this.props.addToCart(this.props.cart.id, this.props.user.id);
      this.tryRedirectAfterLogin(this.props.shop.slug, this.props.user.token);
    });
  }

  clickHandlerFacebook(values) {
    const data = {
      username: values.email,
      name: values.name,
      facebookId: values.id,
      token: values.accessToken,
    };
    this.props.connectFacebook(data).then(() => this.tryFacebookSignUp());
  }
  render() {
    const { user, shop } = this.props;
    return (
      <div className="container">
        {user.loading && <Loading />}
        <TitleHeader showBackButton />
        <LoginForm
          onSubmit={this.handleSubmit}
          showErrors={user.error}
          handleConnectFacebook={this.clickHandlerFacebook}
          shop={shop}
        />
      </div>
    );
  }
}

Login.propTypes = {
  authenticate: PropTypes.func.isRequired,
  connectFacebook: PropTypes.func.isRequired,
  clearLoginAttempt: PropTypes.func.isRequired,
  addToCart: PropTypes.func.isRequired,
  user: PropTypes.shape({
    token: PropTypes.string,
    error: PropTypes.bool,
    facebookData: PropTypes.any,
    id: PropTypes.number,
  }).isRequired,
  shop: PropTypes.shape({
    slug: PropTypes.string,
  }).isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  location: PropTypes.shape({
    search: PropTypes.string,
  }).isRequired,
  cart: PropTypes.shape({
    id: PropTypes.node,
  }).isRequired,
};

function mapStateToProps(state) {
  return state;
}

function matchDispacthToProps(dispatch) {
  return bindActionCreators({
    authenticate,
    connectFacebook,
    clearLoginAttempt,
    addToCart,
  }, dispatch);
}

export default connect(mapStateToProps, matchDispacthToProps)(Login);
