import {
  CURRENT_PRODUCT_FETCH_REQUEST,
  CURRENT_PRODUCT_FETCH_SUCCESS,
  CURRENT_PRODUCT_FETCH_FAILURE,
  CURRENT_PRODUCT_WIPE,
  SET_FILTER_PRODUCT_VARIATION,
} from 'Actions/Types';

const INITIAL_STATE = {
  loading: true,
};

function beautifyProduct(product) {
  return {
    catalogProductId: product.id,
    title: product.name,
    description: product.description,
    brand: product.supplier.name,
    sku: product.sku,
    info: product.short_description,
    price: Number.parseFloat(product.final_price),
    fromPrice: Number.parseFloat(product.final_price),
    images: product.images,
    configurableOptions: product.configurable_options,
    variationsTitle: product.variations_title,
    stockState: product.stock_state,
  };
}

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case CURRENT_PRODUCT_FETCH_REQUEST: {
      if (!action.error) {
        return Object.assign({}, state, { loading: true });
      }
      return Object.assign({}, state, { loading: false, error: true });
    }

    case CURRENT_PRODUCT_FETCH_SUCCESS: {
      return Object.assign({}, state, { loading: false }, beautifyProduct(action.payload));
    }

    case CURRENT_PRODUCT_FETCH_FAILURE: {
      return Object.assign({}, state, { error: true });
    }

    case CURRENT_PRODUCT_WIPE: {
      return INITIAL_STATE;
    }

    case SET_FILTER_PRODUCT_VARIATION: {
      const itensSelections = state.configurableOptions.filter(x =>
        x.id === action.payload.id);
      let images = state.images;
      if (itensSelections.length > 0 &&
         itensSelections[0].images && itensSelections[0].images.length > 0) {
        images = itensSelections[0].images;
      }
      return Object.assign({}, state, { images });
    }

    default:
      return state;
  }
};
