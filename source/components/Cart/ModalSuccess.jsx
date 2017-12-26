import React, { PropTypes } from 'react';
import './ModalCart.css';

function ModalSuccess({ email, storeName, order, deliveryType }) {
  return (
    <div styleName="text-center">
      <div><span styleName="icon-check-success" /></div>
      <div styleName="text_one">Compra realizada com sucesso</div>
      <div styleName="linesplitter" />
      <div styleName="text_two">
        Será enviada uma confirmação para o e-mail <b>{email}</b> com o resumo de sua compra.
      </div>
      {deliveryType === 'BOX' &&
        <div styleName="text_tree">
          Não esqueça de retirar a entrega com {storeName}.
        </div>
      }
      <div styleName="linesplitter" />
      <div styleName="text_four">
        Cód. da Compra {order}
      </div>
    </div>
  );
}

ModalSuccess.propTypes = {
  email: PropTypes.string.isRequired,
  storeName: PropTypes.string.isRequired,
  order: PropTypes.node.isRequired,
  deliveryType: PropTypes.node.isRequired,
};

export default ModalSuccess;
