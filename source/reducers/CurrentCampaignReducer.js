import {
  PROMOTION_FETCH_REQUEST,
  PROMOTION_FETCH_SUCCESS,
  PROMOTION_FETCH_FAILURE,
  SET_FILTER_PARAMS_PROMOTION,
} from 'Actions/Types';

const INITIAL_STATE = {
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
    case PROMOTION_FETCH_REQUEST: {
      if (!action.error) {
        return Object.assign({}, state, { loading: true });
      }
      return Object.assign({}, state, { loading: false, error: true });
    }
    case PROMOTION_FETCH_SUCCESS: {
      const products = action.payload.products.map(beautifyProduct);
      return Object.assign({}, state, { loading: false }, {
        products: action.meta.reload ? action.payload.products :
          [...state.products, ...products],
        pagination: action.payload.pagination,
        cover: action.payload.image,
        name: action.payload.name,
        subtitle: action.payload.subtitle,
      });
      // return Object.assign({}, state, { loading: false }, prepareCampaign(action.payload));
    }
    case PROMOTION_FETCH_FAILURE: {
      return Object.assign({}, state, { error: true });
    }

    case SET_FILTER_PARAMS_PROMOTION: {
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
