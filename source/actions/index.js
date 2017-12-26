import { CALL_API } from 'redux-api-middleware';
import axios from 'axios';
import * as Config from 'Config/Constants';
import * as Types from './Types';

function beautifyPrepareCategories(category) {
  return category.id;
}

function beautifyPrepareBrands(brand) {
  return brand.id;
}

export function fetchStore(slug) {
  return {
    [CALL_API]: {
      endpoint: `${Config.API.baseUrl}/store/slug/${slug}`,
      method: 'GET',
      types: [
        Types.STORE_FETCH_REQUEST,
        Types.STORE_FETCH_SUCCESS,
        Types.STORE_FETCH_FAILURE,
      ],
    },
  };
}

export function fetchPromotion(promotionId, lastPage, params, reload = false) {
  const filters = [];
  if (lastPage && params.pageNumber > 0) {
    filters.push(`pageNumber=${lastPage + 1}`);
  }
  let options = filters.join('&');
  options = options.length > 0 ? `?${options}` : '';
  return {
    [CALL_API]: {
      endpoint: `${Config.apiCache.baseUrl}/promotion/${promotionId}${options}`,
      method: 'GET',
      types: [
        Types.PROMOTION_FETCH_REQUEST,
        {
          type: Types.PROMOTION_FETCH_SUCCESS,
          meta: {
            reload,
          },
        },
        Types.PROMOTION_FETCH_FAILURE,
      ],
    },
  };
}

export function setFilterParams(payload) {
  return {
    type: Types.SET_FILTER_PARAMS,
    payload,
  };
}

export function setFilterProductVariations(payload) {
  return {
    type: Types.SET_FILTER_PRODUCT_VARIATION,
    payload,
  };
}

export function setFilterParamsCustomList(payload) {
  return {
    type: Types.SET_FILTER_PARAMS_CUSTOM_LIST,
    payload,
  };
}

export function setFilterParamsPromotion(payload) {
  return {
    type: Types.SET_FILTER_PARAMS_PROMOTION,
    payload,
  };
}

export function setFilterProductCategory(payload) {
  return {
    type: Types.SET_FILTER_CATEGORY_PRODUCTS,
    payload,
  };
}

export function SET_FILTER_PRODUCT_VARIATION(payload) {
  return {
    type: Types.SET_FILTER_CATEGORY_PRODUCTS,
    payload,
  };
}

export function setFilterProductBrands(payload) {
  return {
    type: Types.SET_FILTER_BRANDS_PRODUCTS,
    payload,
  };
}

export function toggleFiltersView(payload) {
  return {
    type: Types.TOGGLE_SEARCH_FILTER,
    payload,
  };
}

export function toProductView(payload = false) {
  return {
    type: Types.TO_PRODUCT_VIEW,
    payload,
  };
}

export const getProducts = options => axios(`${Config.apiCache.baseUrl}/searchProducts${options}`);
export const getCategories = () => axios(`${Config.apiCache.baseUrl}/product/categories`);
export const getBrands = () => axios(`${Config.apiCache.baseUrl}/supplier/unpaginated?withProducts=false`);

export const fetchProducts = (slug, opts, reload = false, lastPage) => {
  const defaultParams = {
    pageNumber: 1,
    nextPage: 1,
    searchText: '',
    brands: [],
    categories: [],
    minPrice: 0,
    maxPrice: null,
  };
  const filters = [];
  const params = Object.assign({}, defaultParams, opts);
  if (lastPage && params.pageNumber > 0) {
    filters.push(`pageNumber=${lastPage + 1}`);
  }
  if (params.brands.length > 0) {
    const brands = params.brands.map(beautifyPrepareBrands);
    const brandsIds = brands.join(',');
    filters.push(`supplierId=${brandsIds}`);
  }
  if (params.categories.length > 0) {
    const categories = params.categories.map(beautifyPrepareCategories);
    const categoryIds = categories.join(',');
    filters.push(`categoryIds=${categoryIds}`);
  }
  if (params.searchText.length > 0) {
    const searchText = params.searchText;
    filters.push(`searchText=${searchText}`);
  }
  let options = filters.join('&');
  options = options.length > 0 ? `?${options}` : '';

  return (dispatch) => {
    dispatch({
      type: Types.SHOPWINDOW_FETCH_REQUEST,
    });
    axios.all([getProducts(options), getCategories(), getBrands()])
      .then(axios.spread((productRequest, categoryRequest, brandRequest) => {
        dispatch({
          type: Types.SHOPWINDOW_FETCH_SUCCESS,
          meta: {
            params,
            reload,
          },
          payload: { productRequest, categoryRequest, brandRequest },
        });
      }))
      .catch(axios.spread((productRequest, categoryRequest, brandRequest) => {
        dispatch({
          type: Types.SHOPWINDOW_FETCH_FAILURE,
        });
      }));
  };
};

export function fetchProduct(slug, catalogProductId, variationId = null) {
  return {
    [CALL_API]: {
      endpoint: `${Config.API.baseUrl}/product/${catalogProductId}`,
      method: 'GET',
      types: [
        Types.CURRENT_PRODUCT_FETCH_REQUEST,
        {
          type: Types.CURRENT_PRODUCT_FETCH_SUCCESS,
          meta: {
            catalogProductId,
            variationId,
          },
        },
        Types.CURRENT_PRODUCT_FETCH_FAILURE,
      ],
    },
  };
}

export function wipeProduct() {
  return {
    type: Types.CURRENT_PRODUCT_WIPE,
  };
}

export function authenticate(type, data) {
  return {
    [CALL_API]: {
      headers: {
        'Content-Type': 'application/json',
      },
      endpoint: `${Config.API.baseUrl}/user/login`,
      method: 'POST',
      types: [
        Types.USER_AUTHENTICATE_REQUEST,
        Types.USER_AUTHENTICATE_SUCCESS,
        Types.USER_AUTHENTICATE_FAILURE,
      ],
      body: JSON.stringify({ customer: data }),
    },
  };
}

export function fetchCustomer(customerId) {
  return {
    [CALL_API]: {
      headers: {
        'Content-Type': 'application/json',
      },
      endpoint: `${Config.API.baseUrl}/user/login/${customerId}`,
      method: 'POST',
      types: [
        Types.USER_CUSTOMER_REQUEST,
        Types.USER_CUSTOMER_SUCCESS,
        Types.USER_CUSTOMER_FAILURE,
      ],
    },
  };
}

export function connectFacebook(data) {
  return {
    [CALL_API]: {
      headers: {
        'Content-Type': 'application/json',
      },
      endpoint: `${Config.API.baseUrl}/user/facebook`,
      method: 'POST',
      types: [
        Types.USER_FB_CONNECT_REQUEST,
        Types.USER_FB_CONNECT_SUCCESS,
        {
          type: Types.USER_FB_CONNECT_FAILURE,
          meta: data,
        },
      ],
      body: JSON.stringify({ customer: Object.assign(data, { type: 'BUYER' }) }),
    },
  };
}

export function createCart(slug, user, variations = []) {
  let authenticationRequired = false;
  if (user.id) {
    authenticationRequired = true;
  }

  return {
    [CALL_API]: {
      headers: {
        'Content-Type': 'application/json',
      },
      endpoint: `${Config.API.baseUrl}/store/${slug}/create`,
      method: 'POST',
      authenticationRequired: `${authenticationRequired}`,
      types: [
        Types.CREATE_CART_REQUEST,
        Types.CREATE_CART_SUCCESS,
        Types.CREATE_CART_FAILURE,
      ],
      body: JSON.stringify({
        user: user.id || '',
        variations,
      }),
    },
  };
}

export function fetchCart(cartId) {
  return {
    [CALL_API]: {
      endpoint: `${Config.API.baseUrl}/cart/${cartId}`,
      method: 'GET',
      types: [
        Types.FETCH_CART_REQUEST,
        Types.FETCH_CART_SUCCESS,
        Types.FETCH_CART_FAILURE,
      ],
    },
  };
}

export function addToCart(cartId, customerId, productId) {
  const cart = cartId || null;
  const customer = customerId || null;
  const product = productId ? [{ id: productId, quantity: 1 }] : [];

  const params = {
    id: cart,
    customerId: customer,
    products: product,
  };
  return {
    [CALL_API]: {
      headers: {
        'Content-Type': 'application/json',
      },
      endpoint: `${Config.API.baseUrl}/cart/add`,
      method: 'POST',
      types: [
        Types.CREATE_CART_REQUEST,
        Types.CREATE_CART_SUCCESS,
        Types.CREATE_CART_FAILURE,
      ],
      body: JSON.stringify({
        cart: params,
      }),
    },
  };
}

export function removeToCart(cartId, productId) {
  return {
    [CALL_API]: {
      headers: {
        'Content-Type': 'application/json',
      },
      endpoint: `${Config.API.baseUrl}/cart/delete`,
      method: 'POST',
      types: [
        Types.REMOVE_TO_CART_REQUEST,
        Types.REMOVE_TO_CART_SUCCESS,
        Types.REMOVE_TO_CART_FAILURE,
      ],
      body: JSON.stringify({ cartDelete: { cartId, productId } }),
    },
  };
}

export function registerUser(data) {
  return {
    [CALL_API]: {
      headers: {
        'Content-Type': 'application/json',
      },
      endpoint: `${Config.API.baseUrl}/user`,
      method: 'POST',
      types: [
        Types.CREATE_USER_REQUEST,
        Types.CREATE_USER_SUCCESS,
        Types.CREATE_USER_FAILURE,
      ],
      body: JSON.stringify({ customer: Object.assign(data, { type: 'BUYER' }) }),
    },
  };
}

export function updateUser(data) {
  return {
    [CALL_API]: {
      headers: {
        'Content-Type': 'application/json',
      },
      endpoint: `${Config.API.baseUrl}/buyer/${data.id}/users/${data.id}`,
      method: 'PUT',
      types: [
        Types.EDIT_USER_REQUEST,
        Types.EDIT_USER_SUCCESS,
        Types.EDIT_USER_FAILURE,
      ],
      body: JSON.stringify(data),
    },
  };
}

export function clearLoginAttempt() {
  return {
    type: Types.CLEAR_LOGIN_ATTEMPT,
  };
}

export function createOrder(storeId, cartId, type) {
  return {
    [CALL_API]: {
      headers: {
        'Content-Type': 'application/json',
      },
      endpoint: `${Config.API.baseUrl}/order/create`,
      method: 'POST',
      authenticationRequired: true,
      types: [
        Types.CREATE_ORDER_REQUEST,
        Types.CREATE_ORDER_SUCCESS,
        Types.CREATE_ORDER_FAILURE,
      ],
      body: JSON.stringify({ order: { cartId, storeId, type } }),
    },
  };
}

export function createOrderPayment(storeId, orderId, transactionId) {
  return {
    [CALL_API]: {
      headers: {
        'Content-Type': 'application/json',
      },
      endpoint: `${Config.API.baseUrl}/order/create/payment`,
      method: 'POST',
      authenticationRequired: true,
      types: [
        Types.CREATE_ORDER_REQUEST,
        Types.CREATE_ORDER_SUCCESS,
        Types.CREATE_ORDER_FAILURE,
      ],
      body: JSON.stringify({ orderCreatePayment: { storeId, orderId, transactionId } }),
    },
  };
}

export function resetOrderState() {
  return {
    type: Types.RESET_ORDER_STATE,
  };
}

export function resetRemakePaymentOrderState() {
  return {
    type: Types.RESET_REMAKE_PAYMENT_ORDER_STATE,
  };
}

export function remakePaymentForOrder(storeId, orderId, transactionId) {
  return {
    [CALL_API]: {
      headers: {
        'Content-Type': 'application/json',
      },
      endpoint: `${Config.API.baseUrl}/order/create/payment`,
      method: 'POST',
      authenticationRequired: true,
      types: [
        Types.REMAKE_PAYMENT_ORDER_REQUEST,
        Types.REMAKE_PAYMENT_ORDER_SUCCESS,
        Types.REMAKE_PAYMENT_ORDER_FAILURE,
      ],
      body: JSON.stringify({ orderCreatePayment: { storeId, orderId, transactionId } }),
    },
  };
}

export function makePayment(orderId, userId, paymentToken) {
  return {
    [CALL_API]: {
      headers: {
        'Content-Type': 'application/json',
      },
      endpoint: `${Config.API.baseUrl}/paymentsBuyer`,
      method: 'POST',
      types: [
        Types.MAKE_PAYMENT_REQUEST,
        Types.MAKE_PAYMENT_SUCCESS,
        Types.MAKE_PAYMENT_FAILURE,
      ],
      body: JSON.stringify({ order: orderId, user: userId, paymentToken }),
    },
  };
}

export function removeCart() {
  return {
    type: Types.REMOVE_CART,
  };
}

export function myOrders(storeId) {
  return {
    [CALL_API]: {
      headers: {
        'Content-Type': 'application/json',
      },
      endpoint: `${Config.API.baseUrl}/order/buyer?storeId=${storeId}`,
      authenticationRequired: true,
      method: 'GET',
      types: [
        Types.MY_ORDER_REQUEST,
        Types.MY_ORDER_SUCCESS,
        Types.MY_ORDER_FAILURE,
      ],
    },
  };
}

export function recoverPassword(data) {
  return {
    [CALL_API]: {
      headers: {
        'Content-Type': 'application/json',
      },
      endpoint: `${Config.API.baseUrl}/user/password/reset`,
      method: 'POST',
      types: [
        Types.USER_RECOVER_PASSWORD_REQUEST,
        Types.USER_RECOVER_PASSWORD_SUCCESS,
        Types.USER_RECOVER_PASSWORD_FAILURE,
      ],
      body: JSON.stringify({ customer: data }),
    },
  };
}

export function createNewPassword(data) {
  return {
    [CALL_API]: {
      headers: {
        'Content-Type': 'application/json',
      },
      endpoint: `${Config.API.baseUrl}/user/password/create`,
      method: 'POST',
      types: [
        Types.USER_CREATE_NEW_PASSWORD_REQUEST,
        Types.USER_CREATE_NEW_PASSWORD_SUCCESS,
        Types.USER_CREATE_NEW_PASSWORD_FAILURE,
      ],
      body: JSON.stringify({ customer: data }),
    },
  };
}

export function logout() {
  return {
    type: Types.LOGOUT,
  };
}

export function updateQuantityProdutoToCart(data) {
  return {
    [CALL_API]: {
      headers: {
        'Content-Type': 'application/json',
      },
      endpoint: `${Config.API.baseUrl}/cart/edit`,
      method: 'POST',
      types: [
        Types.UPDATE_QTD_PRODUCT_CART_REQUEST,
        Types.UPDATE_QTD_PRODUCT_CART_SUCCESS,
        Types.UPDATE_QTD_PRODUCT_CART_FAILURE,
      ],
      body: JSON.stringify({ cartEdit: data }),
    },
  };
}

export function fetchCampaigns() {
  return {
    [CALL_API]: {
      endpoint: `${Config.apiCache.baseUrl}/promotion/all`,
      method: 'GET',
      types: [
        Types.FETCH_CAMPAIGNS_REQUEST,
        Types.FETCH_CAMPAIGNS_SUCCESS,
        Types.FETCH_CAMPAIGNS_FAILURE,
      ],
    },
  };
}

export function fetchCategories() {
  return {
    [CALL_API]: {
      endpoint: `${Config.apiCache.baseUrl}/product/categories`,
      method: 'GET',
      types: [
        Types.FETCH_CATEGORIES_REQUEST,
        Types.FETCH_CATEGORIES_SUCCESS,
        Types.FETCH_CATEGORIES_FAILURE,
      ],
    },
  };
}

export function fetchBrands() {
  return {
    [CALL_API]: {
      endpoint: `${Config.apiCache.baseUrl}/supplier/unpaginated?withProducts=false`,
      method: 'GET',
      types: [
        Types.FETCH_BRANDS_REQUEST,
        Types.FETCH_BRANDS_SUCCESS,
        Types.FETCH_BRANDS_FAILURE,
      ],
    },
  };
}

export function resolveVisits(slug) {
  return {
    [CALL_API]: {
      headers: {
        'Content-Type': 'application/json',
      },
      endpoint: `${Config.apiCache.baseUrl}/stores/${slug}/pageview/inc`,
      method: 'POST',
      types: [
        Types.SET_VISIT_REQUEST,
        Types.SET_VISIT_SUCCESS,
        Types.SET_VISIT_FAILURE,
      ],
      body: {},
    },
  };
}

export function fetchMethodDeliveryProduct(cep, productId) {
  return {
    [CALL_API]: {
      headers: {
        'Content-Type': 'application/json',
      },
      endpoint: `${Config.API.baseUrl}/shipping/correios/product/${productId}?cep=${cep.replace('-', '')}`,
      method: 'GET',
      types: [
        Types.FETCH_METHOD_DELIVERY_PRODUCT_REQUEST,
        Types.FETCH_METHOD_DELIVERY_PRODUCT_SUCCESS,
        Types.FETCH_METHOD_DELIVERY_PRODUCT_FAILURE,
      ],
    },
  };
}

export function fetchMethodDeliveryCart(cep, cartId) {
  return {
    [CALL_API]: {
      headers: {
        'Content-Type': 'application/json',
      },
      endpoint: `${Config.API.baseUrl}/shipping/correios?quoteId=${cartId}&cep=${cep}`,
      method: 'GET',
      types: [
        Types.FETCH_METHOD_DELIVERY_CART_REQUEST,
        Types.FETCH_METHOD_DELIVERY_CART_SUCCESS,
        Types.FETCH_METHOD_DELIVERY_CART_FAILURE,
      ],
    },
  };
}

export function fetchCampaign(campaignId) {
  return {
    [CALL_API]: {
      endpoint: `${Config.apiCache.baseUrl}/promotion/${campaignId}`,
      method: 'GET',
    },
  };
}

export function fetchSaveAddressForUser(address) {
  const params = {
    city: address.city,
    postcode: address.cep,
    neighborhood: address.neighborhood,
    number: address.number,
    street: address.address,
    street_complement: address.complement,
    country_id: 'BR',
    region_id: '508',
    telephone: address.telephone,
  };
  return {
    [CALL_API]: {
      headers: {
        'Content-Type': 'application/json',
      },
      endpoint: `${Config.API.baseUrl}/address`,
      method: 'POST',
      authenticationRequired: true,
      types: [
        Types.FETCH_ADDRESS_SAVE_REQUEST,
        Types.FETCH_ADDRESS_SAVE_SUCCESS,
        Types.FETCH_ADDRESS_SAVE_FAILURE,
      ],
      body: JSON.stringify({ address: params }),
    },
  };
}

export function fetchCustomList(id, lastPage, params, reload = false) {
  const filters = [];
  if (lastPage && params.pageNumber > 0) {
    filters.push(`pageNumber=${lastPage + 1}`);
  }
  let options = filters.join('&');
  options = options.length > 0 ? `?${options}` : '';
  return {
    [CALL_API]: {
      endpoint: `${Config.apiCache.baseUrl}/customlist/${id}${options}`,
      method: 'GET',
      types: [
        Types.FETCH_CUSTOM_LIST_REQUEST,
        {
          type: Types.FETCH_CUSTOM_LIST_SUCCESS,
          meta: {
            reload,
          },
        },
        Types.FETCH_CUSTOM_LIST_FAILURE,
      ],
    },
  };
}


export const getProductsCategory = (id, page) => axios(`${Config.apiCache.baseUrl}/searchProducts/?categoryIds=${id}${page}`);
export const getCategory = id => axios(`${Config.apiCache.baseUrl}/product/category/${id}`);

export function fetchProductsCategory(id, lastPage, params, reload = false) {
  let page = '';
  if (lastPage && params.pageNumber > 0) {
    page = `&pageNumber=${lastPage + 1}`;
  }
  return (dispatch) => {
    dispatch({
      type: Types.FETCH_CATEGORY_PRODUCTS_REQUEST,
    });
    axios.all([getProductsCategory(id, page), getCategory(id)])
      .then(axios.spread((productsCategoryRequest, categoryRequest) => {
        dispatch({
          type: Types.FETCH_CATEGORY_PRODUCTS_SUCCESS,
          meta: {
            params,
            reload,
          },
          payload: { productsCategoryRequest, categoryRequest },
        });
      }))
      .catch(axios.spread((productsCategoryRequest, categoryRequest) => {
        dispatch({
          type: Types.FETCH_CATEGORY_PRODUCTS_FAILURE,
        });
      }));
  };
}

export const getProductsBrand = (id, page) => axios(`${Config.apiCache.baseUrl}/searchProducts/?supplierId=${id}${page}`);
export const getbrand = id => axios(`${Config.apiCache.baseUrl}/supplier/${id}`);

export const fetchProductsBrands = (id, lastPage, params, reload = false) => {
  let page = '';
  if (lastPage && params.pageNumber > 0) {
    page = `&pageNumber=${lastPage + 1}`;
  }
  return (dispatch) => {
    dispatch({
      type: Types.FETCH_BRANDS_PRODUCTS_REQUEST,
    });
    axios.all([getProductsBrand(id, page), getbrand(id)])
      .then(axios.spread((productsBrandRequest, brandRequest) => {
        dispatch({
          type: Types.FETCH_BRANDS_PRODUCTS_SUCCESS,
          meta: {
            params,
            reload,
          },
          payload: { productsBrandRequest, brandRequest },
        });
      }))
      .catch(axios.spread((productsBrandRequest, brandRequest) => {
        dispatch({
          type: Types.FETCH_BRANDS_PRODUCTS_FAILURE,
        });
      }));
  };
};

export function getAddressByZip(cep) {
  return {
    [CALL_API]: {
      headers: {
        'Content-Type': 'application/json',
      },
      endpoint: `${Config.API.baseUrl}/shipping/cep/${cep}`,
      method: 'GET',
      types: [
        Types.FETCH_API_CEP_REQUEST,
        Types.FETCH_API_CEP_SUCCESS,
        Types.FETCH_API_CEP_FAILURE,
      ],
    },
  };
}
