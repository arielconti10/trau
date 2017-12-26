import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import { registerUser, connectFacebook } from 'Actions';
import StepOne from 'Components/SignUp/StepOne';
import Loading from 'Components/Loading';

class SignUp extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.clickHandlerFacebook = this.clickHandlerFacebook.bind(this);
    this.data = {
      profile: {
        document: {},
        contact: {},
      },
      role: 'BUYER',
      status: 'invite',
    };
  }

  componentWillReceiveProps(nextProps) {
    const { slug } = this.props.shop;
    const { user } = nextProps;
    if (user.token) {
      this.props.history.push(`/${slug}`);
    }
  }

  handleSubmit(values) {
    this.data.name = values.name;
    this.data.email = values.email;
    this.data.cpf = values.cpf;
    this.data.password = values.password || null;
    this.data.confirmpassword = values.confirmpassword || null;
    this.data.seller = this.props.shop;
    if (this.props.user.facebookData) {
      this.data.facebookId = this.props.user.facebookData.facebookId !== undefined ?
        this.props.user.facebookData.facebookId : null;
    }
    this.props.registerUser(this.data);
  }
  clickHandlerFacebook(values) {
    const data = {
      username: values.email,
      name: values.name,
      facebookId: values.id,
      token: values.accessToken,
    };
    this.props.connectFacebook(data);
  }
  render() {
    const { user } = this.props;
    const { facebookData } = this.props.user;

    return (
      <div>
        {user.loading && <Loading />}
        <section>
          <StepOne
            onSubmit={this.handleSubmit}
            handleConnectFacebook={this.clickHandlerFacebook}
            facebookData={facebookData}
            showErrors={user.responseError}
          />
        </section>
      </div>
    );
  }
}

SignUp.propTypes = {
  user: PropTypes.shape({
    token: PropTypes.string,
    error: PropTypes.bool,
    loading: PropTypes.bool,
    facebookData: PropTypes.any,
    responseError: PropTypes.string,
  }).isRequired,
  shop: PropTypes.shape({
    slug: PropTypes.string,
  }).isRequired,
  registerUser: PropTypes.func.isRequired,
  connectFacebook: PropTypes.func.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};


SignUp.defaultProps = {
  params: {},
  shop: {},
};

function mapStateToProps(state) {
  return state;
}

function matchDispacthToProps(dispatch) {
  return bindActionCreators({ registerUser, connectFacebook }, dispatch);
}

export default withRouter(connect(mapStateToProps, matchDispacthToProps)(SignUp));
