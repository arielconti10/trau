import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import { updateUser, myOrders, resetRemakePaymentOrderState, logout } from 'Actions';
import UpdateUserForm from 'Components/UpdateUserForm';
import MyOrdersComponent from 'Components/MyOrders';
import Loading from 'Components/Loading';
import TitleHeader from 'Components/TitleHeader';
import Modal from 'Components/Modal';
import ModalInvoice from 'Containers/Shipping/ModalInvoice';
import ModalSuccess from 'Components/Cart/ModalSuccess';
import ModalError from 'Components/Cart/ModalError';
import './Account.css';

class Account extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentWillMount() {
    this.props.resetRemakePaymentOrderState();
    this.props.myOrders(this.props.shop.id).then((data) => {
      if (data.payload.status === 401) {
        this.props.logout().then(() => {
          this.props.history.push('/login');
        });
      }
    });
  }

  handleSubmit(values) {
    const { user } = this.props;
    const data = Object.assign({}, user);
    data.name = values.name;
    data.email = values.username;
    data.cpf = values.cpf;
    data.address = {
      telephone: values.telephone,
    };
    this.props.updateUser(data);
  }

  render() {
    const { user, shop, orders } = this.props;
    const { remakePaymentOrder } = this.props;
    const listOrders = orders.data.map(myOrder =>
      (<MyOrdersComponent key={`${myOrder.num_order}_${Math.random()}`} myOrder={myOrder} shop={shop} user={user} />));
    const to = '/account';
    const textBackButton = 'Voltar para Minhas Compras';
    return (
      <div>
        {remakePaymentOrder.loading && <Loading />}
        {user.loading && <Loading />}
        {remakePaymentOrder.showModal &&
        <Modal
          isOpen={remakePaymentOrder.showModal}
          slug={this.props.shop.slug}
          goTo={to}
          textBackButton={textBackButton}
          reloadMyOrders
        >
          {remakePaymentOrder.modalCreditCard && <ModalSuccess
            email={this.props.user.email}
            storeName={this.props.shop.name}
            order={remakePaymentOrder.data.increment_id}
            deliveryType={remakePaymentOrder.type}
          />}
          {remakePaymentOrder.modalError && <ModalError />}
          {remakePaymentOrder.modalBoleto && <ModalInvoice
            email={this.props.user.email}
            storeName={this.props.shop.name}
            order={remakePaymentOrder.data}
            deliveryType={remakePaymentOrder.type}
          />}
        </Modal>}
        <section styleName="box">
          <UpdateUserForm
            onSubmit={this.handleSubmit} user={user}
            showErrors={user.responseError} shop={shop}
          />
        </section>
        <div>
          <section styleName="box">
            {orders.loading && <Loading />}
            {orders && orders.data.length > 0 && <div>
              <TitleHeader>Minhas Compras na Loja {shop.title}</TitleHeader>
              {listOrders}
            </div>}
          </section>
        </div>
      </div>
    );
  }
}

Account.propTypes = {
  updateUser: PropTypes.func.isRequired,
  myOrders: PropTypes.func.isRequired,
  resetRemakePaymentOrderState: PropTypes.func.isRequired,
  shop: PropTypes.shape({
    id: PropTypes.number,
    slug: PropTypes.string,
    name: PropTypes.string,
    title: PropTypes.string,
  }).isRequired,
  user: PropTypes.shape({
    token: PropTypes.string,
    id: PropTypes.number,
    name: PropTypes.string,
    cpf: PropTypes.string,
    email: PropTypes.string,
    address: PropTypes.shape({
      postcode: PropTypes.string,
      neighborhood: PropTypes.string,
      number: PropTypes.string,
      city: PropTypes.string,
      street_complement: PropTypes.string,
      street: PropTypes.string,
      telephone: PropTypes.string,
    }),
  }).isRequired,
  orders: PropTypes.shape({
    loading: PropTypes.bool,
  }).isRequired,
  remakePaymentOrder: PropTypes.shape(),
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  logout: PropTypes.func.isRequired,
};

Account.defaultProps = {
  shop: {},
  remakePaymentOrder: {},
};

function mapStateToProps(state) {
  return state;
}

function matchDispacthToProps(dispatch) {
  return bindActionCreators({
    updateUser,
    myOrders,
    resetRemakePaymentOrderState,
    logout,
  }, dispatch);
}

export default withRouter(connect(mapStateToProps, matchDispacthToProps)(Account));
