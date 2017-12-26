import React, { Component, PropTypes } from 'react';
import ReactModal from 'react-modal';
import { removeCart, addToCart, resetOrderState, myOrders, logout } from 'Actions';
import { withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Loading from 'Components/Loading';
import './Modal.css';

class Modal extends Component {
  constructor(props) {
    super(props);
    this.back = this.back.bind(this);
    this.state = {
      isOpen: this.props.isOpen,
    };
  }

  back() {
    const to = this.props.goTo !== '' ? this.props.goTo : '/';
    if (this.props.removeCartAndCreateCart) {
      this.props.removeCart();
      this.props.resetOrderState();
      this.props.addToCart(null, this.props.user.id);
    }
    if (this.props.reloadMyOrders) {
      this.props.myOrders(this.props.shop.id).then((data) => {
        if (data.payload.status === 401) {
          this.props.logout().then(() => {
            this.props.history.push('/login');
          });
        }
      });
    }
    this.props.history.push(to);
    this.setState({ isOpen: false });
    this.forceUpdate();
  }

  render() {
    return (
      <ReactModal
        isOpen={this.state.isOpen}
        contentLabel="Modal Default"
        styleName={`center ${this.props.isSmall ? 'small' : ''} ${this.props.isContact ? 'is-contact' : ''}`}
        onRequestClose={this.props.onRequestClose}
        style={{
          overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            overflow: 'scroll',
          },
          content: this.props.contentCustom,
        }}
      >
        {this.props.loading && <Loading />}
        <div>{this.props.children}</div>
        {!this.props.hideCloseDefault &&
          <button styleName="text-close" onClick={this.back} >{this.props.textBackButton}</button>}
      </ReactModal>
    );
  }
}

Modal.propTypes = {
  children: PropTypes.node,
  isOpen: PropTypes.bool,
  loading: PropTypes.bool,
  removeCartAndCreateCart: PropTypes.bool,
  reloadMyOrders: PropTypes.bool,
  goTo: PropTypes.string,
  textBackButton: PropTypes.string,
  isSmall: PropTypes.bool,
  hideCloseDefault: PropTypes.bool,
  onRequestClose: PropTypes.func,
  removeCart: PropTypes.func.isRequired,
  myOrders: PropTypes.func.isRequired,
  addToCart: PropTypes.func.isRequired,
  isContact: PropTypes.bool,
  contentCustom: PropTypes.shape({}),
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  user: PropTypes.shape({
    token: PropTypes.string,
    id: PropTypes.number,
    email: PropTypes.string,
  }),
  shop: PropTypes.shape({
    id: PropTypes.number,
    slug: PropTypes.string,
    name: PropTypes.string,
  }).isRequired,
  resetOrderState: PropTypes.func.isRequired,
  logout: PropTypes.func.isRequired,
};

Modal.defaultProps = {
  children: '',
  isOpen: false,
  loading: false,
  removeCartAndCreateCart: false,
  reloadMyOrders: false,
  isSmall: true,
  goTo: '',
  textBackButton: 'Voltar à loja',
  hideCloseDefault: false,
  onRequestClose: () => {},
  user: {},
  isContact: false,
  contentCustom: {},
};

function mapStateToProps(state) {
  return state;
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    removeCart,
    addToCart,
    resetOrderState,
    myOrders,
    logout,
  }, dispatch);
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Modal));
