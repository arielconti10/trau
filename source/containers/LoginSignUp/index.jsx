import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { authenticate, clearLoginAttempt, registerUser, addToCart, connectFacebook } from 'Actions';
import { withRouter } from 'react-router-dom';
import TitleHeader from 'Components/TitleHeader';
import LoginForm from 'Components/LoginForm';
import SignUpForm from 'Components/SignUpForm';
import FacebookButton from 'Components/FacebookButton/FacebookButtonSimple';
import FacebookSignupDocumentStep from 'Components/FacebookSignupDocumentStep';
import Loading from 'Components/Loading';
import { webBuyerUrl } from 'Config/Constants';
import qs from 'qs';
import './LoginSignUp.css';

class LoginSignUp extends Component {
  constructor(props) {
    super(props);
    this.qs = qs.parse(this.props.location.search.replace('?', ''));
    this.handleSubmitLogin = this.handleSubmitLogin.bind(this);
    this.handleSubmitSignup = this.handleSubmitSignup.bind(this);
    this.clickHandlerFacebook = this.clickHandlerFacebook.bind(this);
    this.clickHandler = this.clickHandler.bind(this);
    this.data = {};
    this.state = {
      facebookRegister: false,
      dataFacebook: {},
    };
  }

  componentWillMount() {
    this.clickHandlerFacebook(this.qs);
    this.props.clearLoginAttempt();
  }

  componentWillReceiveProps(nextProps) {
    const { slug } = nextProps.shop;
    const { token } = nextProps.user;
    const { user } = nextProps;
    this.tryRedirectAfterLogin(slug, token);

    if (user.token) {
      this.props.history.push('/');
    }
  }

  tryRedirectAfterLogin(slug, token) {
    if (token) {
      const { url } = this.qs;
      this.props.history.push(url || '/');
    }
  }

  handleSubmitLogin(values) {
    const data = {
      email: values.email,
      password: values.password,
    };
    this.props.authenticate('LOCAL', data).then(() => {
      this.props.addToCart(this.props.cart.id, this.props.user.id);
      this.tryRedirectAfterLogin(this.props.shop.slug, this.props.user.token);
    });
  }

  handleSubmitSignup(values) {
    this.data.name = values.name;
    this.data.email = values.email;
    this.data.password = values.password || null;
    this.data.cpf = values.cpf;
    if (this.props.user.facebookData) {
      this.data.facebookId = this.props.user.facebookData.facebookId !== undefined ?
        this.props.user.facebookData.facebookId : null;
    }
    this.props.registerUser(this.data).then(() => {
      this.props.addToCart(this.props.cart.id, this.props.user.id);
      this.tryRedirectAfterLogin(this.props.shop.slug, this.props.user.token);
    });
  }

  clickHandlerFacebook(values) {
    const data = {
      facebookId: values.facebookId,
      facebookToken: values.facebookToken,
    };
    if (data.facebookId) {
      this.props.connectFacebook(data).then(() => {
        this.props.addToCart(this.props.cart.id, this.props.user.id);
        if (!this.props.user.cpf) {
          this.setState({ dataFacebook: data });
          this.setState({ facebookRegister: true });
        } else {
          this.tryRedirectAfterLogin(this.props.shop.slug, this.props.user.token);
        }
      });
    }
  }

  clickHandler() {
    const { slug } = this.props.shop;
    const { url } = this.qs;
    let redirect = '';
    if (url) {
      redirect = `url=${url}`;
    }
    window.location.href = `${webBuyerUrl.protocol}://login.${webBuyerUrl.host}/loginfb/${slug}?${redirect}`;
  }

  render() {
    const { user } = this.props;
    const { facebookData } = this.props.user;
    const loginFailed = user.error && !user.responseError;
    return (
      <div className="container">
        {user.loading && <Loading />}
        <TitleHeader showBackButton />
        <div styleName="wrapper">
          <div styleName="btn-fb">
            <FacebookButton handleSubmitFacebook={this.clickHandler} />
          </div>
          {this.state.facebookRegister &&
            <FacebookSignupDocumentStep
              dataFacebook={this.state.dataFacebook}
              showErrors={user.responseErrorFb}
            />}
          {!this.state.facebookRegister &&
          <div>
            <div className="col-md-6 col-sm-6">
              <div styleName="col-left">
                <h1 styleName="subtitle">Já tenho uma conta</h1>
                <LoginForm
                  onSubmit={this.handleSubmitLogin}
                  showErrors={loginFailed}
                />
              </div>
            </div>
            <div className="col-md-6 col-sm-6">
              <div styleName="col-right">
                <h1 styleName="subtitle">Criar uma conta</h1>
                <SignUpForm
                  onSubmit={this.handleSubmitSignup}
                  facebookData={facebookData}
                  showErrors={user.responseError}
                />
              </div>
            </div>
          </div>}
        </div>
      </div>
    );
  }
}

LoginSignUp.propTypes = {
  authenticate: PropTypes.func.isRequired,
  connectFacebook: PropTypes.func.isRequired,
  clearLoginAttempt: PropTypes.func.isRequired,
  addToCart: PropTypes.func.isRequired,
  user: PropTypes.shape({
    token: PropTypes.string,
    cpf: PropTypes.string,
    error: PropTypes.bool,
    facebookData: PropTypes.any,
    id: PropTypes.number,
  }).isRequired,
  shop: PropTypes.shape({
    slug: PropTypes.string,
  }).isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
    go: PropTypes.func.isRequired,
  }).isRequired,
  registerUser: PropTypes.func.isRequired,
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
    registerUser, authenticate, clearLoginAttempt, connectFacebook, addToCart,
  }, dispatch);
}

export default withRouter(connect(mapStateToProps, matchDispacthToProps)(LoginSignUp));
