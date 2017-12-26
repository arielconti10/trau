import React, { PropTypes, Component } from 'react';
import OrderItem from 'Components/OrderItem';
import CurrencyFormat from 'Components/CurrencyFormat';
import RemakePaymentButton from 'Components/RemakePaymentButton';
import './MyOrders.css';

class MyOrders extends Component {
  render() {
    const { myOrder, shop, user } = this.props;
    const { products } = myOrder;
    function formatTypeOrder(type) {
      switch (type) {
        case 'PAGO':
          return 'Pago';
        case 'COMPRADO':
          return 'Pago';
        case 'CANCELADO':
          return 'Cancelado';
        case 'RECUSADO':
          return 'Compra cancelada';
        case 'PAGAMENTO_ESTORNADO':
          return 'Compra cancelada';
        case 'FALHA_NO_PAGAMENTO':
          return 'Falha';
        case 'PAGAMENTO_NAO_IDENTIFICADO':
          return 'Não identificado';
        case 'AGUARDANDO_PAGAMENTO':
          return 'Aguardando confirmação';
        case 'CRIADO':
          return 'Aguardando confirmação';
        case 'pending_payment':
          return 'Pagamento pendente';
        case 'processing':
          return 'Aguardando pagamento';
        case 'paid':
          return 'Pago';
        case 'canceled':
          return 'Cancelado';
        case 'pending':
          return 'Aguardando pagamento';
        default:
          return '';
      }
    }

    return (
      <div styleName="box">
        <div styleName="box-header">
          <div styleName="box-header-info">
            <span styleName="field">Compra:</span>
            <span styleName="value">{ myOrder.num_order }</span>
          </div>
          <div styleName="box-header-info">
            <span styleName="field">Data:</span>
            <span styleName="value">{ myOrder.created_at }</span>
          </div>
          <div styleName="box-header-info">
            <span styleName="field">Frete:</span>
            {myOrder.deliveryType === 'DIRECT' &&
              <span styleName="value"><CurrencyFormat value={myOrder.deliveryPrice} /></span>
            }
            {myOrder.deliveryType === 'BOX' &&
              <span styleName="value"><CurrencyFormat value={0} /></span>
            }
          </div>
          <div styleName="box-header-info">
            <span styleName="field">Valor:</span>
            <span styleName="value"><CurrencyFormat value={myOrder.reseller_total} /></span>
          </div>
          <div styleName="box-header-info">
            <span styleName="field">Produtos:</span>
            <span styleName="value">{ myOrder.products.length }</span>
          </div>
        </div>
        <div className="row">
          {products && products.map(product =>
            <OrderItem key={`${product.variationId}_${Math.random()}`} product={product} fullwidth />,
          )}
        </div>
        <div styleName="box-footer">
          <div styleName="box-header-info">
            <span styleName="field">Status do pagamento:</span>
            <span styleName="value">{formatTypeOrder(myOrder.status)}</span>
          </div>
          <div styleName="box-header-info">
            {myOrder.status !== 'canceled'
              && myOrder.status !== 'paid'
              && myOrder.transaction
              && myOrder.transaction.payment_type
              && myOrder.transaction.payment_type.toLowerCase() === 'boleto'
              &&
              <a
                type="button"
                styleName="resend-ticket"
                href={myOrder.transaction.boleto_url}
                target="_blank"
                rel="noopener noreferrer"
              >Reenviar Boleto</a>
            }
            {(myOrder.status === 'processing' || myOrder.status === 'pending' || Object.keys(myOrder.transaction).length === 0) &&
              myOrder.status !== 'canceled' &&
              <RemakePaymentButton
                myOrder={myOrder}
                shop={shop}
                user={user}
                remakePaymentsButton={this.props.remakePaymentsButton}
              >
                Refazer pagamento
              </RemakePaymentButton>
            }
            {myOrder.deliveryType === 'BOX' && myOrder.status === 'paid' &&
              <div styleName="box-header-info">
                <span styleName="field">Entrega:</span>
                <span styleName="value">Retirar com vendedor</span>
              </div>
            }
          </div>
        </div>
      </div>
    );
  }
}

MyOrders.propTypes = Object.assign({
  myOrder: PropTypes.shape().isRequired,
  remakePaymentsButton: PropTypes.bool,
  shop: PropTypes.shape({
    slug: PropTypes.string,
    name: PropTypes.string,
  }).isRequired,
  user: PropTypes.shape({
    token: PropTypes.string,
    id: PropTypes.number,
    email: PropTypes.string,
  }).isRequired,
});

MyOrders.defaultProps = {
  myOrder: {},
  remakePaymentsButton: true,
};

export default MyOrders;
