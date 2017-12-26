import React, { Component, PropTypes } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import './BackButton.css';

class BackButton extends Component {
  constructor(props) {
    super(props);
    this.backAction = this.backAction.bind(this);
  }
  backAction() {
    this.props.history.push('/');
  }
  render() {
    const { children } = this.props;
    return (
      <button styleName="back" onClick={this.backAction}>
        {children}
      </button>
    );
  }
}

BackButton.propTypes = {
  children: PropTypes.node,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};

BackButton.defaultProps = {
  children: 'Voltar',
};

function mapStateToProps(state) {
  return state;
}

export default withRouter(connect(mapStateToProps)(BackButton));
