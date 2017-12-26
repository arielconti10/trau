import {
  FETCH_CUSTOM_LIST_REQUEST,
  FETCH_CUSTOM_LIST_SUCCESS,
  FETCH_CUSTOM_LIST_FAILURE,
  SET_FILTER_PARAMS_CUSTOM_LIST,
} from 'Actions/Types';

const INITIAL_STATE = {
  error: false,
  loading: false,
  products: [],
  categories: [],
  brands: [],
  hasNextPage: true,
  pagination: {},
  params: {
    pageNumber: 0,
    searchText: '',
    brand: '',
    categories: [],
    minPrice: 0,
    maxPrice: 0,
  },
};

function beautifyProduct(product) {
  return Object.assign(product, {
    images: product.images && product.images.length > 0 ? product.images[0] : null,
    price: parseFloat(product.final_price),
  });
}

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case FETCH_CUSTOM_LIST_REQUEST: {
      if (!action.error) {
        return Object.assign({}, state, { loading: true });
      }
      return Object.assign({}, state, { loading: false, error: true });
    }

    case FETCH_CUSTOM_LIST_SUCCESS: {
      const name = action.payload.name;
      const newProducts = action.payload.products.map(beautifyProduct);
      const products = action.meta.reload ? action.payload.products :
          [...state.products, ...newProducts];

      let image = null;
      if (products.length > 0) {
        const product = products[0];
        image = product.images;
      }
      return Object.assign({}, state, { loading: false }, {
        products,
        pagination: action.payload.pagination,
        image,
        name,
      });
    }

    case FETCH_CUSTOM_LIST_FAILURE: {
      return Object.assign({}, state, { error: true });
    }

    case SET_FILTER_PARAMS_CUSTOM_LIST: {
      if (action.payload === null) {
        if (state.isProductView) {
          return Object.assign({}, state);
        }
        return Object.assign({}, INITIAL_STATE);
      }

      const params = Object.assign({}, state.params, action.payload);
      return Object.assign({}, state, { params });
    }

    default:
      return state;
  }
};
