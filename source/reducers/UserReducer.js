import {
  USER_AUTHENTICATE_REQUEST,
  USER_AUTHENTICATE_SUCCESS,
  USER_AUTHENTICATE_FAILURE,
  CREATE_USER_REQUEST,
  CREATE_USER_SUCCESS,
  CREATE_USER_FAILURE,
  USER_FB_CONNECT_REQUEST,
  USER_FB_CONNECT_SUCCESS,
  USER_FB_CONNECT_FAILURE,
  EDIT_USER_REQUEST,
  EDIT_USER_SUCCESS,
  EDIT_USER_FAILURE,
  USER_RECOVER_PASSWORD_REQUEST,
  USER_RECOVER_PASSWORD_SUCCESS,
  USER_RECOVER_PASSWORD_FAILURE,
  CLEAR_LOGIN_ATTEMPT,
  LOGOUT,
  FETCH_ADDRESS_SAVE_REQUEST,
  FETCH_ADDRESS_SAVE_SUCCESS,
  FETCH_ADDRESS_SAVE_FAILURE,
  FETCH_API_CEP_REQUEST,
  FETCH_API_CEP_SUCCESS,
  FETCH_API_CEP_FAILURE,
} from 'Actions/Types';

const INITIAL_STATE = {
  error: false,
  loading: false,
  token: null,
  responseError: null,
  responseErrorFb: null,
  facebookData: {},
  address: {},
};

function prepareUserAddress(data) {
  return {
    postcode: data.postcode,
    street: data.street,
    number: null,
    street_complement: null,
    neighborhood: data.neighborhood,
    city: data.city,
  };
}

function prepareMesageErro(error) {
  let message = '';
  if (typeof error.fieldErrors !== 'undefined' || error.fieldErrors !== null) {
    const fieldErrors = error.fieldErrors;
    const keys = Object.keys(fieldErrors);
    const fieldMessageError = fieldErrors[keys[0]][0];
    message = `${keys[0]}.${fieldMessageError}`.toLowerCase();
  }
  return message;
}

function beautifyUser(user) {
  return Object.assign(user, {
    image_url: (user.facebook_id && user.facebook_id !== null) ? `https://graph.facebook.com/${user.facebook_id}/picture?type=large` : user.image_url,
  });
}

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case FETCH_API_CEP_REQUEST:
    case USER_FB_CONNECT_REQUEST:
    case FETCH_ADDRESS_SAVE_REQUEST:
    case EDIT_USER_REQUEST:
    case CREATE_USER_REQUEST:
    case USER_RECOVER_PASSWORD_REQUEST:
    case USER_AUTHENTICATE_REQUEST: {
      if (!action.error) {
        return Object.assign({}, state, { loading: true });
      }
      return Object.assign({}, state,
        { loading: false, error: true, responseError: null, responseErrorFb: null });
    }

    case USER_AUTHENTICATE_SUCCESS:
    case EDIT_USER_SUCCESS:
    case USER_FB_CONNECT_SUCCESS:
    case USER_RECOVER_PASSWORD_SUCCESS:
    case CREATE_USER_SUCCESS: {
      return Object.assign({}, state,
        { loading: false, responseError: null, responseErrorFb: null },
        beautifyUser(action.payload));
    }

    case FETCH_ADDRESS_SAVE_SUCCESS: {
      return Object.assign({}, state,
        { loading: false, responseError: null, responseErrorFb: null },
        { address: action.payload });
    }

    case FETCH_API_CEP_FAILURE:
    case USER_AUTHENTICATE_FAILURE:
    case USER_RECOVER_PASSWORD_FAILURE: {
      return Object.assign({}, state, {
        error: true,
        loading: false,
        responseError: null,
        responseErrorFb: null,
      });
    }

    case EDIT_USER_FAILURE:
    case CREATE_USER_FAILURE: {
      let message = null;
      if (action.payload.response && action.payload.response && action.payload.response.message) {
        message = prepareMesageErro(JSON.parse(action.payload.response.message));
      }
      return Object.assign({}, state, {
        error: true,
        loading: false,
        responseErrorFb: null,
      },
      { responseError: message });
    }

    case USER_FB_CONNECT_FAILURE: {
      let message = null;
      if (action.payload.response && action.payload.response.message) {
        message = prepareMesageErro(JSON.parse(action.payload.response.message));
      }
      if (action.meta.facebookId) {
        return Object.assign({}, state, {
          error: false,
          loading: false,
          responseErrorFb: null,
        },
        { facebookData: action.meta },
        { responseErrorFb: message });
      }
      return Object.assign({}, state, { loading: false, error: true, responseErrorFb: null },
        { responseError: message });
    }

    case FETCH_ADDRESS_SAVE_FAILURE: {
      return Object.assign({}, state, { error: true });
    }

    case CLEAR_LOGIN_ATTEMPT: {
      return Object.assign({}, state, { facebookData: null });
    }

    case LOGOUT: {
      return Object.assign({}, INITIAL_STATE);
    }

    case FETCH_API_CEP_SUCCESS: {
      return Object.assign(
        {},
        state,
        { loading: false, error: false },
        { address: prepareUserAddress(action.payload) },
      );
    }

    default:
      return state;
  }
};
