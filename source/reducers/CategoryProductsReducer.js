import {
  FETCH_CATEGORY_PRODUCTS_REQUEST,
  FETCH_CATEGORY_PRODUCTS_SUCCESS,
  FETCH_CATEGORY_PRODUCTS_FAILURE,
  SET_FILTER_CATEGORY_PRODUCTS,
} from 'Actions/Types';

const INITIAL_STATE = {
  error: false,
  loading: false,
  products: [],
  categories: [],
  brands: [],
  hasNextPage: true,
  pagination: {},
  image: '',
  name: '',
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
    case FETCH_CATEGORY_PRODUCTS_REQUEST: {
      if (!action.error) {
        return Object.assign({}, state, { loading: true });
      }
      return Object.assign({}, state, { loading: false, error: true });
    }

    case FETCH_CATEGORY_PRODUCTS_SUCCESS: {
      const productsCategory = action.payload.productsCategoryRequest.data;
      const category = action.payload.categoryRequest.data;

      const newProducts = productsCategory.products.map(beautifyProduct);
      const products = action.meta.reload ? productsCategory.products :
          [...state.products, ...newProducts];

      return Object.assign({}, state, { loading: false }, {
        products,
        pagination: productsCategory.pagination,
        image: category.image_url,
        name: category.name,
      });
    }

    case FETCH_CATEGORY_PRODUCTS_FAILURE: {
      return Object.assign({}, state, { error: true });
    }

    case SET_FILTER_CATEGORY_PRODUCTS: {
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
