import {
  REMAKE_PAYMENT_ORDER_REQUEST,
  REMAKE_PAYMENT_ORDER_SUCCESS,
  REMAKE_PAYMENT_ORDER_FAILURE,
  RESET_REMAKE_PAYMENT_ORDER_STATE,
} from 'Actions/Types';

const INITIAL_STATE = {
  error: false,
  loading: false,
  modalCreditCard: false,
  modalBoleto: false,
  modalError: false,
  showModal: false,
};

function beautifySucessRemakeOrder(data) {
  if (!data) {
    return {};
  }

  return {
    modalCreditCard: data.payment.type.toLowerCase() === 'credit_card' || false,
    modalBoleto: data.payment.type.toLowerCase() === 'boleto' || false,
    showModal: true,
    type: data.type,
    data,
  };
}

function beautifyErrorRemakeOrder() {
  return {
    modalError: true,
    modalCreditCard: false,
    modalBoleto: false,
    showModal: true,
  };
}

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case REMAKE_PAYMENT_ORDER_REQUEST: {
      if (!action.error) {
        return Object.assign({}, state, { loading: true, error: false });
      }
      return Object.assign({}, state, { loading: false, error: true });
    }

    case REMAKE_PAYMENT_ORDER_SUCCESS: {
      return Object.assign({}, state, { loading: false, error: false },
        beautifySucessRemakeOrder(action.payload));
    }

    case REMAKE_PAYMENT_ORDER_FAILURE: {
      return Object.assign({}, state, { error: true, loading: false }, beautifyErrorRemakeOrder());
    }

    case RESET_REMAKE_PAYMENT_ORDER_STATE: {
      return Object.assign({}, INITIAL_STATE);
    }


    default:
      return state;
  }
};
