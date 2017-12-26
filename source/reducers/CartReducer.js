import {
  CREATE_CART_REQUEST,
  CREATE_CART_SUCCESS,
  CREATE_CART_FAILURE,
  FETCH_CART_REQUEST,
  FETCH_CART_SUCCESS,
  FETCH_CART_FAILURE,
  FETCH_PAYMENT_OPTIONS_REQUEST,
  FETCH_PAYMENT_OPTIONS_SUCCESS,
  FETCH_PAYMENT_OPTIONS_FAILURE,
  REMOVE_TO_CART_REQUEST,
  REMOVE_TO_CART_SUCCESS,
  REMOVE_TO_CART_FAILURE,
  UPDATE_QTD_PRODUCT_CART_REQUEST,
  UPDATE_QTD_PRODUCT_CART_SUCCESS,
  UPDATE_QTD_PRODUCT_CART_FAILURE,
  REMOVE_CART,
  FETCH_METHOD_DELIVERY_PRODUCT_REQUEST,
  FETCH_METHOD_DELIVERY_PRODUCT_SUCCESS,
  FETCH_METHOD_DELIVERY_PRODUCT_FAILURE,
  FETCH_METHOD_DELIVERY_CART_REQUEST,
  FETCH_METHOD_DELIVERY_CART_SUCCESS,
  FETCH_METHOD_DELIVERY_CART_FAILURE,
} from 'Actions/Types';

const INITIAL_STATE = {
  id: null,
  products: [],
  delivery: {
    type: null,
    price: null,
    error: false,
  },
};

function beautifyProducts(data) {
  const newData = data;

  if (!data) {
    return {};
  }

  const products = data.products.map((product) => {
    const image = product.images && product.images.length > 0 ? product.images.shift() : null;
    return {
      catalogProductId: product.id,
      title: product.name,
      brand: product.supplier ? product.supplier.name : null,
      quantity: product.quantity,
      price: Number.parseFloat(product.final_price),
      images: image,
      quantityVariations: product.stock_state,
      variations_value: product.variations,
      variations_name: product.variations_title,
    };
  });

  newData.products = products;
  return newData;
}

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case UPDATE_QTD_PRODUCT_CART_REQUEST:
    case FETCH_PAYMENT_OPTIONS_REQUEST:
    case REMOVE_TO_CART_REQUEST:
    case FETCH_CART_REQUEST:
    case CREATE_CART_REQUEST: {
      if (!action.error) {
        return Object.assign({}, state, { loading: true });
      }
      return Object.assign({}, state, { loading: false, error: true });
    }

    case FETCH_PAYMENT_OPTIONS_FAILURE:
    case REMOVE_TO_CART_FAILURE:
    case UPDATE_QTD_PRODUCT_CART_FAILURE:
    case FETCH_CART_FAILURE:
    case CREATE_CART_FAILURE: {
      return Object.assign({}, state, { error: true, loading: false });
    }

    case FETCH_CART_SUCCESS:
    case UPDATE_QTD_PRODUCT_CART_SUCCESS:
    case REMOVE_TO_CART_SUCCESS:
    case CREATE_CART_SUCCESS: {
      return Object.assign({}, state,
        { error: false, loading: false }, beautifyProducts(action.payload));
    }

    case FETCH_PAYMENT_OPTIONS_SUCCESS: {
      return Object.assign({}, state, { loading: false }, action.payload);
    }

    case REMOVE_CART: {
      return Object.assign({}, INITIAL_STATE, { loading: false });
    }

    case FETCH_METHOD_DELIVERY_PRODUCT_REQUEST:
    case FETCH_METHOD_DELIVERY_CART_REQUEST: {
      if (!action.error) {
        return Object.assign({}, state, { loading: true });
      }
      return Object.assign({}, state, { loading: false, error: true });
    }

    case FETCH_METHOD_DELIVERY_PRODUCT_SUCCESS:
    case FETCH_METHOD_DELIVERY_CART_SUCCESS: {
      return Object.assign({}, state, { error: false, loading: false },
        { delivery: action.payload });
    }

    case FETCH_METHOD_DELIVERY_CART_FAILURE:
    case FETCH_METHOD_DELIVERY_PRODUCT_FAILURE: {
      return Object.assign({}, INITIAL_STATE, { error: true, loading: false },
        { delivery: action.payload });
    }

    default:
      return state;
  }
};
