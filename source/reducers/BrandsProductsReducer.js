import {
  SET_FILTER_BRANDS_PRODUCTS,
  FETCH_BRANDS_PRODUCTS_REQUEST,
  FETCH_BRANDS_PRODUCTS_SUCCESS,
  FETCH_BRANDS_PRODUCTS_FAILURE,
} from 'Actions/Types';

const INITIAL_STATE = {
  error: false,
  loading: false,
  products: [],
  categories: [],
  brands: [],
  hasNextPage: true,
  pagination: {},
  name: '',
  about: '',
  image: '',
  cover: '',
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
    case FETCH_BRANDS_PRODUCTS_REQUEST: {
      if (!action.error) {
        return Object.assign({}, state, { loading: true });
      }
      return Object.assign({}, state, { loading: false, error: true });
    }

    case FETCH_BRANDS_PRODUCTS_SUCCESS: {
      const productsBrand = action.payload.productsBrandRequest.data;
      const brand = action.payload.brandRequest.data;
      const newProducts = productsBrand.products.map(beautifyProduct);
      const products = action.meta.reload ? productsBrand.products :
          [...state.products, ...newProducts];

      return Object.assign({}, state, { loading: false }, {
        products,
        pagination: productsBrand.pagination,
        name: brand.name,
        about: brand.about,
        image: brand.image,
        cover: brand.cover,
      });
    }

    case FETCH_BRANDS_PRODUCTS_FAILURE: {
      return Object.assign({}, state, { error: true });
    }

    case SET_FILTER_BRANDS_PRODUCTS: {
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
