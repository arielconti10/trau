import React, { PropTypes } from 'react';
import './ModalCart.css';

function ModalSendEmail({ email, storeName, boleto, amount, order }) {
  return (
    <div styleName="text-center">
      <div><span styleName="icon-check-warning" /></div>
      <div styleName="text_one">Dá uma olhadinha no seu e-mail</div>
      <div styleName="linesplitter" />
      <div styleName="text_two">
        O boleto foi encaminhado para o e-mail <b>{email}</b>. Os produtos serão
        liberados assim que o seu pagamento for confirmado pelo banco.
      </div>
      <div styleName="text_tree">
        Não esqueça de retirar a entrega com {storeName}.
      </div>
      <div styleName="linesplitter" />
      <div styleName="text_four values">
        <div className="col-xs-6">
          <div>
            Data de Vencimento
          </div>
          <div styleName="text-values">
            { new Date(boleto.dueDate).toLocaleDateString('pt-BR', {
              day: '2-digit',
              month: '2-digit',
              year: '2-digit',
            }).split(' ').join(' ')}
          </div>
        </div>
        <div className="col-xs-6">
          <div>
            Valor Total
          </div>
          <div styleName="text-values">
            R$ {amount} à vista
          </div>
        </div>
        <div className="col-xs-6">
          <div styleName="space-values">
            Cód. da Compra
          </div>
          <div styleName="text-values">
            {order}
          </div>
        </div>
        <div className="col-xs-6">
          <div styleName="space-values">
            Cód. de Barras
          </div>
          <div styleName="text-values">
            {boleto.barCode}
          </div>
        </div>
      </div>
      <div styleName="text_four">
        <a rel="noopener noreferrer" target="_blank" href={boleto.link}>Visualizar Boleto</a>
      </div>
      <div styleName="linesplitter" />
    </div>
  );
}

ModalSendEmail.propTypes = {
  storeName: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  amount: PropTypes.number.isRequired,
  order: PropTypes.number.isRequired,
  boleto: PropTypes.shape({
    dueDate: PropTypes.string.isRequired,
    barCode: PropTypes.string.isRequired,
    link: PropTypes.string.isRequired,
  }).isRequired,
};

ModalSendEmail.defaultProps = {
  // paymentLink: '',
};

export default ModalSendEmail;
