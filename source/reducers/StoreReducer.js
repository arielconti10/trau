import { createSelector } from 'reselect';
import {
  STORE_FETCH_REQUEST,
  STORE_FETCH_SUCCESS,
  STORE_FETCH_FAILURE,
} from 'Actions/Types';

const INITIAL_STATE = {
  error: false,
  loading: true,
  slug: '',
  title: '',
  description: '',
  image: '',
  flDirectSale: '',
  flPersonalSale: '',
  email: '',
  phone: '',
  id: '',
};

function beautifyShop(data) {
  const customer = data.customer;
  let telephone = null;
  if (customer.address && customer.address.telephone) {
    telephone = customer.address.telephone;
  }
  let city = null;
  if (customer.address && customer.address.city) {
    city = customer.address.city;
  }
  return {
    name: customer.name,
    description: customer.description,
    image: data.image_url,
    flDirectSale: data.fl_direct_sale,
    flPersonalSale: data.fl_personal_sale,
    email: customer.email,
    phone: telephone,
    id: data.id,
    title: data.name,
    city,
  };
}

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case STORE_FETCH_REQUEST:
      if (!action.error) {
        return Object.assign({}, state, { loading: true });
      }
      return Object.assign({}, state, { loading: false, error: true });

    case STORE_FETCH_SUCCESS:
      return Object.assign({}, state, { loading: false }, beautifyShop(action.payload));

    case STORE_FETCH_FAILURE:
      return Object.assign({}, state, { error: true });

    default:
      return state;
  }
};

export const shopSelector = ({ shop }) => shop;
export const slugSelector = createSelector(
  shopSelector,
  ({ slug }) => slug,
);
