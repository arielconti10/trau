import React, { PropTypes } from 'react';
import OrderTotal from 'Components/OrderTotal';
import OrderSubTotal from 'Components/OrderSubTotal';
import DeliveryType from 'Components/DeliveryType';
import ProductItem from 'Components/ProductItem';
import CheckoutButton from 'Components/CheckoutButton';
import './ModalShopReview.css';

function ModalShopReview({
  type,
  cart,
  delivery,
  shop,
  user,
  order,
  handleStateChange,
}) {
  const productItens = cart.products.map(product =>
    <ProductItem key={product.catalogProductId} product={product} />);

  const deliveryPrice = type === 'seller' ? null : delivery.price;
  const deliveryTitle = type === 'seller' ? 'Retirar com' : 'Entregar no meu endereço';
  const deliveryDeadline = type === 'seller' ? 'De 15 à 25 dias úteis' : 'Até 10 dias úteis';
  const deliveryMan = type === 'seller' ? shop.name : '';
  Object.assign(cart, { delivery });
  let amount = 0;
  if (deliveryPrice) {
    amount = parseFloat(cart.total_price) + parseFloat(deliveryPrice);
  } else {
    amount = parseFloat(cart.total_price);
  }

  return (
    <div styleName="wrapper">
      <div styleName="inner-wrapper">
        <h3 styleName="title">Revise sua compra</h3>
        <div styleName="products">
          <span styleName="subtitle">Itens em sua compra</span>
          {productItens}
        </div>
        <div styleName="delivery">
          <span styleName="subtitle">Tipo de entrega escolhido</span>
          <DeliveryType
            title={deliveryTitle}
            type={type}
            name={type}
            sellerName={deliveryMan}
            sellerDelivery={deliveryDeadline}
            largeStyle
            hideValues
          />
        </div>
        <OrderSubTotal
          amount={cart.total_price}
          amountDelivery={deliveryPrice}
        />
        <OrderTotal
          amount={amount}
          smallStyle
        />
        <CheckoutButton
          cart={cart} order={order} shop={shop} user={user} typeSale={type}
          deliveryPrice={deliveryPrice} removeCartAndCreateCart
        >
          Efetuar pagamento
        </CheckoutButton>
      </div>
      <button styleName="modal-close" onClick={handleStateChange} />
    </div>
  );
}

ModalShopReview.propTypes = {
  handleStateChange: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired,
  delivery: PropTypes.shape({
    price: PropTypes.number,
  }).isRequired,
  cart: PropTypes.shape({
    id: PropTypes.number,
    installments: PropTypes.array,
    total: PropTypes.number,
    interest: PropTypes.number,
    loading: PropTypes.bool,
    delivery: PropTypes.shape({
      price: PropTypes.number,
    }),
    products: PropTypes.arrayOf(PropTypes.shape({
      quantity: PropTypes.number,
      variationId: PropTypes.number,
      brand: PropTypes.string,
      title: PropTypes.string,
      price: PropTypes.node,
      axes: PropTypes.arrayOf(PropTypes.shape({
        desc: PropTypes.node,
        id: PropTypes.node,
        hex: PropTypes.node,
      })),
      images: PropTypes.string,
    })),
  }).isRequired,
  order: PropTypes.shape({
    error: PropTypes.bool,
    amount: PropTypes.number,
    order: PropTypes.number,
    boleto: PropTypes.shape({
      link: PropTypes.string,
      barCode: PropTypes.string,
      dueDate: PropTypes.string,
    }),
    paymentType: PropTypes.string,
  }).isRequired,
  user: PropTypes.shape({
    token: PropTypes.string,
    id: PropTypes.number,
    email: PropTypes.string,
    nome: PropTypes.string,
  }).isRequired,
  shop: PropTypes.shape({
    slug: PropTypes.string,
    image: PropTypes.string,
    name: PropTypes.string,
    phone: PropTypes.string,
    email: PropTypes.string,
  }).isRequired,
};

export default ModalShopReview;
