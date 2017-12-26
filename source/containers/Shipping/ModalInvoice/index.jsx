import React from 'react';
import './ModalInvoice.css';

function ModalInvoice({ email, storeName, order, deliveryType }) {
  const copyTextToClipboard = (text) => {
    const textArea = document.createElement('textarea');
    textArea.style.position = 'fixed';
    textArea.style.top = 0;
    textArea.style.left = 0;
    textArea.style.width = '2em';
    textArea.style.height = '2em';
    textArea.style.padding = 0;
    textArea.style.border = 'none';
    textArea.style.outline = 'none';
    textArea.style.boxShadow = 'none';
    textArea.style.background = 'transparent';
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
  };

  const barCode = order.payment.boleto_bar_code;

  return (
    <div styleName="invoice-modal-inner-wrapper">
      <div styleName="invoice-ready">Pronto, boleto gerado!</div>
      <div styleName="invoice-warn">
        <strong>Atenção</strong><br />
        Seu boleto vence <em>amanha!</em> <br />
        Pague antes do vencimento para garantir a oferta.
      </div>
      <div styleName="invoice-message">
        O boleto foi encaminhado para o <em>e-mail {email}</em>.
        Os produtos serão liberados assim que o seu pagamento for
        confirmado pelo banco.
        {window.console.log('deliveryType ->', deliveryType)}
        {deliveryType === 'BOX' &&
          <div>
            Não esqueça de retirar a entrega com <strong>{storeName}</strong>.
          </div>
        }
      </div>
      <div styleName="invoice-status-wrapper">
        <div className="col-md-6" styleName="invoice-status">
          Cód. da Compra <br />
          <em>{order.increment_id}</em>
        </div>
        <div className="col-md-6" styleName="invoice-status">
          Valor total <br />
          <em>R$ {order.payment.amount} à vista</em>
        </div>
      </div>
      <div styleName="invoice-code">
        Cód. de Barras <br />
        <em>{order.payment.boleto_bar_code}</em>
      </div>
      <div styleName="invoice-buttons">
        <a
          styleName="btn-default btn-invoice btn-gray" rel="noopener noreferrer" target="_blank" href={`${order.payment.boleto_url}`}
        >
          Ver Boleto
        </a>
        <button
          styleName="btn-default btn-invoice"
          type="button"
          onClick={() => { copyTextToClipboard(barCode); }}
        >
          Copiar Cod. de Barras
        </button>
      </div>
    </div>
  );
}

export default ModalInvoice;
