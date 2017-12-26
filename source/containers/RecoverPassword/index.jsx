import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import { recoverPassword } from 'Actions';
import RecoverPasswordForm from 'Components/RecoverPasswordForm';
import Loading from 'Components/Loading';

class RecoverPassword extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = {
      sendmail: false,
    };
  }

  handleSubmit(values) {
    // const { slug } = this.props.shop;
    this.props.recoverPassword(Object.assign(values, { storeSubdomain: 'login' }))
    .then((data) => {
      if (data.payload === true) {
        this.setState({ sendmail: data.payload });
      }
    });
  }

  render() {
    const { user, shop } = this.props;
    return (
      <div>
        {user.loading && <Loading />}
        <section>
          <RecoverPasswordForm
            onSubmit={this.handleSubmit}
            shop={shop}
            sendMail={this.state.sendmail}
          />
        </section>
      </div>
    );
  }
}

RecoverPassword.propTypes = {
  recoverPassword: PropTypes.func.isRequired,
  shop: PropTypes.shape({
    slug: PropTypes.string,
  }).isRequired,
  user: PropTypes.shape({
    loading: PropTypes.bool,
  }).isRequired,
};


RecoverPassword.defaultProps = {
  shop: {},
};

function mapStateToProps(state) {
  return state;
}

function matchDispacthToProps(dispatch) {
  return bindActionCreators({ recoverPassword }, dispatch);
}

export default withRouter(connect(mapStateToProps, matchDispacthToProps)(RecoverPassword));
