import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import { createNewPassword } from 'Actions';
import NewPasswordForm from 'Components/NewPasswordForm';
import Loading from 'Components/Loading';
import qs from 'qs';

class NewPassword extends Component {
  constructor(props) {
    super(props);
    this.qs = qs.parse(this.props.location.search.replace('?', ''));
    if (!this.qs || !this.qs.id || !this.qs.token) {
      this.props.history.push('/erro');
    }
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(values) {
    const data = {
      id: this.qs.id,
      resetToken: this.qs.token,
      newPassword: values.password,
    };
    this.props.createNewPassword(data).then((response) => {
      if (!response.error) {
        window.alert('Sua senha foi alterada com sucesso'); // eslint-disable-line no-alert
        window.location.href = 'http://lua.net';
      }
    });
  }

  render() {
    const { resetPassword } = this.props;
    return (
      <div>
        {resetPassword.loading && <Loading />}
        <section>
          <NewPasswordForm
            onSubmit={this.handleSubmit} showError={resetPassword.responseError}
          />
        </section>
      </div>
    );
  }
}

NewPassword.propTypes = {
  createNewPassword: PropTypes.func.isRequired,
  resetPassword: PropTypes.shape({
    error: PropTypes.bool,
    loading: PropTypes.bool,
    responseError: PropTypes.string,
  }).isRequired,
  location: PropTypes.shape({
    search: PropTypes.string,
  }).isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};


NewPassword.defaultProps = {
  shop: {},
};

function mapStateToProps(state) {
  return state;
}

function matchDispacthToProps(dispatch) {
  return bindActionCreators({ createNewPassword }, dispatch);
}

export default withRouter(connect(mapStateToProps, matchDispacthToProps)(NewPassword));
