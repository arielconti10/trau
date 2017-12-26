import {
  USER_CREATE_NEW_PASSWORD_REQUEST,
  USER_CREATE_NEW_PASSWORD_SUCCESS,
  USER_CREATE_NEW_PASSWORD_FAILURE,
} from 'Actions/Types';

const INITIAL_STATE = {
  error: false,
  loading: false,
  responseError: null,
};

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


export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case USER_CREATE_NEW_PASSWORD_REQUEST: {
      if (!action.error) {
        return Object.assign({}, state, { loading: true });
      }
      return Object.assign({}, state, { loading: false, error: true, responseError: null });
    }

    case USER_CREATE_NEW_PASSWORD_SUCCESS: {
      return Object.assign({}, state, { loading: false, responseError: null });
    }

    case USER_CREATE_NEW_PASSWORD_FAILURE: {
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

    default:
      return state;
  }
};
