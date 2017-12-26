import {
  CREATE_ORDER_REQUEST,
  CREATE_ORDER_SUCCESS,
  CREATE_ORDER_FAILURE,
  RESET_ORDER_STATE,
} from 'Actions/Types';

const INITIAL_STATE = {
  error: false,
  loading: false,
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case CREATE_ORDER_REQUEST: {
      if (!action.error) {
        return Object.assign({}, state, { loading: true, error: false });
      }
      return Object.assign({}, state, { loading: false, error: true });
    }

    case CREATE_ORDER_SUCCESS: {
      return Object.assign({}, state, { loading: false, error: false }, action.payload);
    }

    case CREATE_ORDER_FAILURE: {
      const payload = action.payload;
      if (payload.status !== 401 && payload.response && payload.response.message) {
        const responseMessage = JSON.parse(payload.response.message);
        return Object.assign({}, state,
          { error: true, loading: false },
          { responseMessage: responseMessage.generalErrors[0] },
        );
      }
      return Object.assign({}, state, { error: true, loading: false });
    }

    case RESET_ORDER_STATE: {
      return Object.assign({}, INITIAL_STATE);
    }

    default:
      return state;
  }
};
