import React from 'react';
import './ModalCart.css';

function ModalError() {
  return (
    <div styleName="text-center">
      <div><span styleName="icon-check-error" /></div>
      <div styleName="text_one">Ops, a compra não foi autorizada</div>
      <div styleName="linesplitter" />
      <div styleName="text_two">
        O pagamento não foi aprovado pela operadora do seu cartão.
        Para saber o motivo, entre em contato com o banco.
      </div>
      <div styleName="text_tree">
        Tente novamente ou escolha outra forma de pagamento.
      </div>
      <div styleName="linesplitter" />
    </div>
  );
}

export default ModalError;
