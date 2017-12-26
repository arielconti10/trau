import { combineReducers } from 'redux';
import { reducer as FormReducer } from 'redux-form';
import StoreReducer from 'Reducers/StoreReducer';
import ShopWindowReducer from 'Reducers/ShopWindowReducer';
import CurrentProductReducer from 'Reducers/CurrentProductReducer';
import UserReducer from 'Reducers/UserReducer';
import CartReducer from 'Reducers/CartReducer';
import OrdersReducer from 'Reducers/OrdersReducer';
import CurrentCampaignReducer from 'Reducers/CurrentCampaignReducer';
import CampaignsReducer from 'Reducers/CampaignsReducer';
import OrderReducer from 'Reducers/OrderReducer';
import CustomListReducer from 'Reducers/CustomListReducer';
import CategoryProductsReducer from 'Reducers/CategoryProductsReducer';
import BrandsProductsReducer from 'Reducers/BrandsProductsReducer';
import ResetPasswordReducer from 'Reducers/ResetPasswordReducer';
import RemakePaymentOrderReducer from 'Reducers/RemakePaymentOrderReducer';

const rootReducer = combineReducers({
  shop: StoreReducer,
  shopWindow: ShopWindowReducer,
  currentProduct: CurrentProductReducer,
  form: FormReducer,
  user: UserReducer,
  cart: CartReducer,
  orders: OrdersReducer,
  currentCampaign: CurrentCampaignReducer,
  campaigns: CampaignsReducer,
  order: OrderReducer,
  customList: CustomListReducer,
  categoryProducts: CategoryProductsReducer,
  brandsProducts: BrandsProductsReducer,
  resetPassword: ResetPasswordReducer,
  remakePaymentOrder: RemakePaymentOrderReducer,
});

export default rootReducer;
