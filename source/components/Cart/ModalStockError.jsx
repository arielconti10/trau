import React from 'react';
import '../Cart/ModalCart.css';

function ModalStockError() {
  return (
    <div styleName="text-center">
      <div><span styleName="icon-check-error" /></div>
      <div styleName="text_one">Este Produto está fora de estoque.</div>
      <div styleName="linesplitter" />
    </div>
  );
}

export default ModalStockError;
