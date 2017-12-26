import {
  MY_ORDER_REQUEST,
  MY_ORDER_SUCCESS,
  MY_ORDER_FAILURE,
} from 'Actions/Types';

const INITIAL_STATE = {
  error: false,
  loading: false,
  data: [],
};

function beautifyOrders(orders) {
  return orders.map((order) => {
    let lastTransaction = {};
    if (order.transactions && order.transactions.length > 0) {
      const count = order.transactions.length;
      lastTransaction = order.transactions[count - 1];
    }
    return {
      created_at: order.sale_date.split(' ')[0],
      num_order: order.increment_id,
      payments: order.payments,
      products: order.products,
      reseller_total: parseFloat(order.total_cost),
      seller: order.seller,
      status: order.status,
      id: order.id,
      uid: order.uid,
      updated_at: order.updated_at,
      transaction: lastTransaction,
      deliveryType: order.type,
      deliveryPrice: order.shipping_cost,
    };
  });
}

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case MY_ORDER_REQUEST: {
      if (!action.error) {
        return Object.assign({}, state, { loading: true });
      }
      return Object.assign({}, state, { loading: false, error: true });
    }

    case MY_ORDER_SUCCESS: {
      return Object.assign({}, state, { loading: false },
        { data: beautifyOrders(action.payload.orders) });
    }

    case MY_ORDER_FAILURE: {
      console.log(action.payload);
      return Object.assign({}, state, { error: true });
    }

    default:
      return state;
  }
};
