import {
  SHOPWINDOW_FETCH_REQUEST,
  SHOPWINDOW_FETCH_SUCCESS,
  SHOPWINDOW_FETCH_FAILURE,
  FETCH_CAMPAIGN_REQUEST,
  FETCH_CAMPAIGN_SUCCESS,
  FETCH_CAMPAIGN_FAILURE,
  SET_FILTER_PARAMS,
  TOGGLE_SEARCH_FILTER,
  TO_PRODUCT_VIEW,
  FETCH_CATEGORIES_REQUEST,
  FETCH_CATEGORIES_SUCCESS,
  FETCH_CATEGORIES_FAILURE,
  FETCH_BRANDS_REQUEST,
  FETCH_BRANDS_SUCCESS,
  FETCH_BRANDS_FAILURE,
} from 'Actions/Types';

const INITIAL_STATE = {
  error: false,
  title: '',
  description: '',
  image: '',
  loading: false,
  products: [],
  categories: [],
  brands: [],
  pagination: {},
  minPrice: 0,
  maxPrice: 0,
  hasNextPage: false,
  isCampaign: false,
  searchFilterView: true,
  isProductView: false,
  params: {
    pageNumber: 0,
    nextPage: 1,
    searchText: '',
    brands: [],
    categories: [],
    minPrice: 0,
    maxPrice: 0,
    loadNewPage: true,
  },
};

function beautifyProduct(product) {
  return Object.assign(product, {
    images: product.images && product.images.length > 0 ? product.images[0] : null,
    price: parseFloat(product.final_price),
  });
}

function beautifyParamsCategories(category) {
  return category.id;
}

function beautifyParamsBrands(brand) {
  return brand.id;
}

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case FETCH_CAMPAIGN_REQUEST:
    case FETCH_CATEGORIES_REQUEST:
    case FETCH_BRANDS_REQUEST:
    case SHOPWINDOW_FETCH_REQUEST:
      if (!action.error) {
        return Object.assign({}, state, { loading: true });
      }
      return Object.assign({}, state, { loading: false, error: true });

    case SHOPWINDOW_FETCH_SUCCESS: {
      const paramsBrands = state.params.brands.length > 0 ?
        state.params.brands.map(beautifyParamsBrands) : [];
      const paramsCategories = state.params.categories.length > 0 ?
        state.params.categories.map(beautifyParamsCategories) : [];
      const result = {
        brands: action.payload.brandRequest.data,
        categories: action.payload.categoryRequest.data,
        products: action.payload.productRequest.data.products,
        pagination: action.payload.productRequest.data.pagination,
      };
      const categories = result.categories.map((category) => {
        let selected = false;
        if (paramsCategories.filter(t => t === category.id).length > 0) {
          selected = true;
        }
        return {
          id: category.id,
          image_url: category.image_url,
          name: category.name,
          selected,
        };
      });
      const brands = result.brands.map((brand) => {
        let selected = false;
        if (paramsBrands.filter(t => t === brand.id).length > 0) {
          selected = true;
        }
        return {
          id: brand.id,
          image_url: brand.image_url,
          name: brand.name,
          selected,
        };
      });
      const products = result.products.map(beautifyProduct);
      return Object.assign({}, state, { loading: false }, {
        products: action.meta.reload ? result.products :
          [...state.products, ...products],
        pagination: result.pagination,
        brands,
        categories,
        hasNextPage: true,
        isCampaign: false,
      });
    }

    case FETCH_CAMPAIGN_SUCCESS: {
      const products = action.payload.products.map(beautifyProduct);
      return Object.assign({}, state, { loading: false }, {
        products: [...state.products, ...products],
        hasNextPage: action.payload.hasNext,
        title: action.payload.name,
        image: action.payload.image,
        description: action.payload.description,
        isCampaign: true,
      });
    }
    case FETCH_CATEGORIES_SUCCESS: {
      return Object.assign({}, state, { loading: false }, {
        categories: action.payload.map(prepareCategories),
      });
    }

    case FETCH_BRANDS_SUCCESS: {
      return Object.assign({}, state, { loading: false }, {
        brands: action.payload.map(prepareSuppliers),
      });
    }

    case FETCH_CAMPAIGN_FAILURE:
    case FETCH_CATEGORIES_FAILURE:
    case FETCH_BRANDS_FAILURE:
    case SHOPWINDOW_FETCH_FAILURE:
      return Object.assign({}, state, { error: true });

    case SET_FILTER_PARAMS: {
      if (action.payload === null) {
        if (state.params.searchText.length && state.isCampaign) {
          return state;
        }

        if (state.isProductView) {
          return Object.assign({}, state);
        }
        return Object.assign({}, INITIAL_STATE);
      }

      const params = Object.assign({}, state.params, action.payload);
      return Object.assign({}, state, { params });
    }

    case TOGGLE_SEARCH_FILTER: {
      return Object.assign({}, state, { searchFilterView: action.payload });
    }

    case TO_PRODUCT_VIEW: {
      return Object.assign({}, state, { isProductView: !state.isProductView });
    }

    default:
      return state;
  }
};
